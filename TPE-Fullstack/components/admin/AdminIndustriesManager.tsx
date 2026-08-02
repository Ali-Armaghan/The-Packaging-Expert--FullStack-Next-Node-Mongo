"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AgenticLoader } from "@/components/ui/AgenticLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageUploadField } from "./ImageUploadField";
import { MultiImageUpload } from "./MultiImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { slugify } from "@/lib/slug";

type FaqItem = { question: string; answer: string };
type BlogImageDetail = {
  title: string;
  description: string;
  image: string;
};

type IndustryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  pageTitle: string;
  shortDescription: string;
  types: string[];
  faqs: FaqItem[];
  blogImageDetails: BlogImageDetail[];
  attachedImages: string[];
  isActive: boolean;
  sortOrder: number;
};

const emptyForm = (): Omit<IndustryRow, "id"> => ({
  name: "",
  slug: "",
  icon: "",
  pageTitle: "",
  shortDescription: "",
  types: [],
  faqs: [],
  blogImageDetails: [],
  attachedImages: [],
  isActive: true,
  sortOrder: 0,
});

export function AdminIndustriesManager() {
  const [items, setItems] = useState<IndustryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [typeInput, setTypeInput] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/industries");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load industries");
      }
      setItems(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load industries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
    setTypeInput("");
    setSlugTouched(false);
  };

  const startCreate = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(true);
    setSlugTouched(false);
    setSuccess(null);
    setError(null);
  };

  const startEdit = (item: IndustryRow) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      pageTitle: item.pageTitle,
      shortDescription: item.shortDescription,
      types: item.types,
      faqs: item.faqs,
      blogImageDetails: item.blogImageDetails,
      attachedImages: item.attachedImages,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
    setSlugTouched(true);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        faqs: form.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
        blogImageDetails: form.blogImageDetails.filter(
          (item) => item.title.trim() && item.image.trim(),
        ),
      };

      const res = await fetch(
        editingId
          ? `/api/admin/industries/${editingId}`
          : "/api/admin/industries",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save industry");
      }

      setSuccess(editingId ? "Industry updated." : "Industry created.");
      resetForm();
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save industry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this industry?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/industries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete industry");
      }
      setSuccess("Industry deleted.");
      if (editingId === id) resetForm();
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete industry");
    }
  };

  const addType = () => {
    const value = typeInput.trim();
    if (!value) return;
    if (form.types.includes(value)) {
      setTypeInput("");
      return;
    }
    setForm((prev) => ({ ...prev, types: [...prev.types, value] }));
    setTypeInput("");
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Industries</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage industry pages with FAQs, media, and details.
          </p>
        </div>
        <Button type="button" onClick={startCreate} className="gap-1.5">
          <PlusIcon className="size-4" />
          Add industry
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>
                {editingId ? "Edit industry" : "Create industry"}
              </CardTitle>
              <CardDescription>
                Upload assets to S3 and fill page content sections below.
              </CardDescription>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={resetForm}>
              <XIcon />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Basic
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry-name">Name</Label>
                    <Input
                      id="industry-name"
                      required
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          name,
                          slug: slugTouched ? prev.slug : slugify(name),
                        }));
                      }}
                      placeholder="Apparel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry-slug">Slug</Label>
                    <Input
                      id="industry-slug"
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setForm((prev) => ({
                          ...prev,
                          slug: slugify(e.target.value),
                        }));
                      }}
                      placeholder="apparel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Icon upload</Label>
                  <ImageUploadField
                    value={form.icon}
                    onChange={(icon) => setForm((prev) => ({ ...prev, icon }))}
                    folder="industries/icons"
                    label="Upload icon"
                    square
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="industry-active"
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="industry-active" className="font-normal">
                    Active
                  </Label>
                </div>
              </section>

              <Separator />

              {/* Page details */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Page details
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="page-title">Title</Label>
                  <Input
                    id="page-title"
                    value={form.pageTitle}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pageTitle: e.target.value,
                      }))
                    }
                    placeholder="Custom packaging for apparel brands"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short-description">Short description</Label>
                  <textarea
                    id="short-description"
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        shortDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="A short intro under the title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Types under industries</Label>
                  <div className="flex flex-wrap gap-2">
                    {form.types.map((type) => (
                      <Badge key={type} variant="secondary" className="gap-1 pr-1">
                        {type}
                        <button
                          type="button"
                          className="rounded-sm p-0.5 hover:bg-muted"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              types: prev.types.filter((t) => t !== type),
                            }))
                          }
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex max-w-md gap-2">
                    <Input
                      value={typeInput}
                      onChange={(e) => setTypeInput(e.target.value)}
                      placeholder="e.g. T-shirts, Hoodies"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addType();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addType}>
                      Add
                    </Button>
                  </div>
                </div>
              </section>

              <Separator />

              {/* FAQ */}
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    FAQ section
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        faqs: [...prev.faqs, { question: "", answer: "" }],
                      }))
                    }
                  >
                    <PlusIcon className="size-3.5" />
                    Add FAQ
                  </Button>
                </div>

                {form.faqs.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No FAQs yet. Add a question and rich-text answer.
                  </p>
                )}

                <div className="space-y-4">
                  {form.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="space-y-3 rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Label>Question title</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              faqs: prev.faqs.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                      <Input
                        value={faq.question}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            faqs: prev.faqs.map((item, i) =>
                              i === index
                                ? { ...item, question: e.target.value }
                                : item,
                            ),
                          }))
                        }
                        placeholder="What packaging options do you offer?"
                      />
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <RichTextEditor
                          value={faq.answer}
                          onChange={(answer) =>
                            setForm((prev) => ({
                              ...prev,
                              faqs: prev.faqs.map((item, i) =>
                                i === index ? { ...item, answer } : item,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Blog image details */}
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Blog image detail
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        blogImageDetails: [
                          ...prev.blogImageDetails,
                          { title: "", description: "", image: "" },
                        ],
                      }))
                    }
                  >
                    <PlusIcon className="size-3.5" />
                    Add item
                  </Button>
                </div>

                {form.blogImageDetails.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add title, description, and image blocks.
                  </p>
                )}

                <div className="space-y-4">
                  {form.blogImageDetails.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-lg border border-border p-4 md:grid-cols-[140px_1fr]"
                    >
                      <ImageUploadField
                        value={item.image}
                        onChange={(image) =>
                          setForm((prev) => ({
                            ...prev,
                            blogImageDetails: prev.blogImageDetails.map(
                              (row, i) =>
                                i === index ? { ...row, image } : row,
                            ),
                          }))
                        }
                        folder="industries/blog"
                        label="Image"
                        square
                      />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Label>Title</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                blogImageDetails: prev.blogImageDetails.filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              blogImageDetails: prev.blogImageDetails.map(
                                (row, i) =>
                                  i === index
                                    ? { ...row, title: e.target.value }
                                    : row,
                              ),
                            }))
                          }
                          placeholder="Detail title"
                        />
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              blogImageDetails: prev.blogImageDetails.map(
                                (row, i) =>
                                  i === index
                                    ? { ...row, description: e.target.value }
                                    : row,
                              ),
                            }))
                          }
                          rows={3}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Attached images */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Attached images
                </h2>
                <p className="text-sm text-muted-foreground">
                  Multiple square images uploaded to S3.
                </p>
                <MultiImageUpload
                  values={form.attachedImages}
                  onChange={(attachedImages) =>
                    setForm((prev) => ({ ...prev, attachedImages }))
                  }
                  folder="industries/attached"
                  label="Add square image"
                />
              </section>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving} className="gap-1.5">
                  {saving ? (
                    <>
                      <AgenticLoader size="sm" label="Saving" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update industry"
                  ) : (
                    "Create industry"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All industries</CardTitle>
          <CardDescription>
            {items.length} industr{items.length === 1 ? "y" : "ies"} in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2.5 py-6 text-sm text-muted-foreground">
              <AgenticLoader size="sm" label="Loading industries" />
              Loading industries...
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No industries yet. Create the first one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Industry</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Types</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.icon}
                            alt=""
                            className="size-9 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="size-9 rounded-md border bg-muted" />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.pageTitle || "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.slug}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.types.slice(0, 3).map((type) => (
                          <Badge key={type} variant="outline">
                            {type}
                          </Badge>
                        ))}
                        {item.types.length > 3 && (
                          <Badge variant="outline">+{item.types.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "secondary" : "outline"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => startEdit(item)}
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => void handleDelete(item.id)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
