"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BlogRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export function BlogRichTextEditor({
  value,
  onChange,
  placeholder = "Write your article...",
  className,
}: BlogRichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showAltPrompt, setShowAltPrompt] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
      }),
      CharacterCount,
    ],
    content: value || "",
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      onChange(html);
      setHtmlSource(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || showHtml) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
      setHtmlSource(value || "");
    }
  }, [editor, value, showHtml]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog/content");
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: { url?: string };
      };
      if (!res.ok || !data.success || !data.data?.url) {
        throw new Error(data.error || "Upload failed");
      }
      setPendingImageUrl(data.data.url);
      setAltText("");
      setShowAltPrompt(true);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const insertImageWithAlt = () => {
    if (!editor || !pendingImageUrl) return;
    const alt = altText.trim();
    if (!alt) {
      window.alert("Alt text is required for SEO-friendly images.");
      return;
    }
    editor
      .chain()
      .focus()
      .setImage({ src: pendingImageUrl, alt })
      .run();
    setShowAltPrompt(false);
    setPendingImageUrl("");
    setAltText("");
  };

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="min-h-[380px] rounded-md border border-border bg-muted/30" />
    );
  }

  const words = editor.storage.characterCount?.words?.() ?? 0;
  const chars = editor.storage.characterCount?.characters?.() ?? 0;

  return (
    <div className={cn("overflow-hidden rounded-md border border-border", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadImage(file);
          event.target.value = "";
        }}
      />

      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-1.5">
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Bold"
        >
          <BoldIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Italic"
        >
          <ItalicIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Underline"
        >
          <UnderlineIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          label="Strike"
        >
          <StrikethroughIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          label="Highlight"
        >
          <HighlighterIcon />
        </ToolBtn>
        <Sep />
        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Heading 2"
        >
          <Heading2Icon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="Heading 3"
        >
          <Heading3Icon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="Quote"
        >
          <QuoteIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          label="Code block"
        >
          <CodeIcon />
        </ToolBtn>
        <Sep />
        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Bullet list"
        >
          <ListIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Ordered list"
        >
          <ListOrderedIcon />
        </ToolBtn>
        <Sep />
        <ToolBtn
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          label="Align left"
        >
          <AlignLeftIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          label="Align center"
        >
          <AlignCenterIcon />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          label="Align right"
        >
          <AlignRightIcon />
        </ToolBtn>
        <Sep />
        <ToolBtn
          active={editor.isActive("link")}
          onClick={setLink}
          label="Link"
        >
          <LinkIcon />
        </ToolBtn>
        <ToolBtn
          onClick={() => fileInputRef.current?.click()}
          label="Insert image"
          disabled={uploading}
        >
          <ImagePlusIcon />
        </ToolBtn>
        <Sep />
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} label="Undo">
          <Undo2Icon />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} label="Redo">
          <Redo2Icon />
        </ToolBtn>
        <Button
          type="button"
          size="sm"
          variant={showHtml ? "secondary" : "ghost"}
          className="ml-auto h-7 text-xs"
          onClick={() => {
            if (showHtml) {
              editor.commands.setContent(htmlSource || "", { emitUpdate: true });
              onChange(htmlSource);
            } else {
              setHtmlSource(editor.getHTML());
            }
            setShowHtml((prev) => !prev);
          }}
        >
          {showHtml ? "Visual" : "HTML"}
        </Button>
      </div>

      {showAltPrompt && (
        <div className="space-y-3 border-b border-border bg-primary/5 p-4">
          <p className="text-sm font-medium">Image alt text (required for SEO)</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="image-alt">Describe the image</Label>
              <Input
                id="image-alt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g. Custom corrugated box with green logo"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={insertImageWithAlt}>
                Insert image
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAltPrompt(false);
                  setPendingImageUrl("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showHtml ? (
        <textarea
          value={htmlSource}
          onChange={(e) => setHtmlSource(e.target.value)}
          className="min-h-[320px] w-full resize-y bg-muted/20 px-4 py-3 font-mono text-xs outline-none"
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      <div className="flex justify-between border-t border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        <span>{uploading ? "Uploading image..." : "Ultra rich text · SEO image alt supported"}</span>
        <span>
          {words} words · {chars} characters
        </span>
      </div>
    </div>
  );
}

function Sep() {
  return <span className="mx-0.5 h-5 w-px self-center bg-border" />;
}

function ToolBtn({
  children,
  onClick,
  active,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
