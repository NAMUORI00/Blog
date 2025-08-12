import { Client, isFullBlock } from "@notionhq/client";
import type {
  GetBlockResponse,
  RichTextItemResponse,
  EquationRichTextItemResponse,
  MentionRichTextItemResponse,
  BlockObjectResponse,
} from "@notionhq/client";
import {
  CustomTransformer,
  MdBlock,
  NotionToMarkdownOptions,
  CalloutIcon,
} from "./types";
import {
  getBlockChildren,
  getPageRelrefFromId,
  plainText,
} from "./notion";

type AudioBlockObjectResponse = Extract<
  BlockObjectResponse,
  { type: "audio" }
>;
type PdfBlockObjectResponse = Extract<
  BlockObjectResponse,
  { type: "pdf" }
>;
type VideoBlockObjectResponse = Extract<
  BlockObjectResponse,
  { type: "video" }
>;
type TextRichText = Extract<RichTextItemResponse, { type: "text" }>;

const inlineCode = (text: string) => `\`${text}\``;
const bold = (text: string) => `**${text}**`;
const italic = (text: string) => `_${text}_`;
const strikethrough = (text: string) => `~~${text}~~`;
const underline = (text: string) => `<u>${text}</u>`;
const link = (text: string, href: string) => `[${text}](${href})`;
const codeBlock = (text: string, language?: string) => {
  if (language === "plain text") language = "text";
  return `\`\`\`${language}\n${text}\n\`\`\``;
};
const heading1 = (text: string) => `# ${text}`;
const heading2 = (text: string) => `## ${text}`;
const heading3 = (text: string) => `### ${text}`;
const quote = (text: string) => `> ${text.replace(/\n/g, "  \n> ")}`;
const callout = (text: string, icon?: CalloutIcon) => {
  let emoji: string | undefined;
  if (icon?.type === "emoji") {
    emoji = icon.emoji;
  }
  return `> ${emoji ? emoji + " " : ""}${text.replace(/\n/g, "  \n> ")}`;
};
const bullet = (text: string, count?: number) => {
  const renderText = text.trim();
  return count ? `${count}. ${renderText}` : `- ${renderText}`;
};
const todo = (text: string, checked: boolean) =>
  checked ? `- [x] ${text}` : `- [ ] ${text}`;
const image = (alt: string, href: string) => `![${alt}](${href})`;
const addTabSpace = (text: string, n = 0) => {
  const tab = " ";
  for (let i = 0; i < n; i++) {
    if (text.includes("\n")) {
      const multiLineText = text.split(/(?<=\n)/).join(tab);
      text = tab + multiLineText;
    } else {
      text = tab + text;
    }
  }
  return text;
};
const divider = () => "---";
const toggle = (summary?: string, children?: string) => {
  if (!summary) return children || "";
  return `<details>\n  <summary>${summary}</summary>\n\n${children || ""}\n\n  </details>`;
};
const table = (cells: string[][]): string => {
  if (cells.length === 0) return "";
  const header = cells[0];
  const rows = [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
  ];
  for (let i = 1; i < cells.length; i++) {
    rows.push(`| ${cells[i].join(" | ")} |`);
  }
  return rows.join("\n");
};
const equation = (expression: string) => `\\[${expression}\\]`;
function textRichText(text: TextRichText): string {
  const annotations = text.annotations;
  let content = text.text.content;
  if (annotations.bold) {
    content = bold(content);
  }
  if (annotations.code) {
    content = inlineCode(content);
  }
  if (annotations.italic) {
    content = italic(content);
  }
  if (annotations.strikethrough) {
    content = strikethrough(content);
  }
  if (annotations.underline) {
    content = underline(content);
  }
  if (text.href) {
    content = link(content, text.href);
  }
  return content;
}
function equationRichText(text: EquationRichTextItemResponse): string {
  return `\\(${text.equation.expression}\\)`;
}
async function mentionRichText(
  text: MentionRichTextItemResponse,
  notion: Client
): Promise<string> {
  const mention = text.mention;
  switch (mention.type) {
    case "page": {
      const pageId = mention.page.id;
      const { title, relref } = await getPageRelrefFromId(pageId, notion);
      return link(title, relref);
    }
    case "user": {
      const userId = mention.user.id;
      try {
        const user = await notion.users.retrieve({ user_id: userId });
        if (user.name) {
          return `@${user.name}`;
        }
      } catch (error) {
        console.warn(`Failed to retrieve user with id ${userId}`);
      }
      return "";
    }
    case "date": {
      const date = mention.date;
      const dateEnd = date.end ? ` -> ${date.end}` : "";
      const timeZone = date.time_zone ? ` (${date.time_zone})` : "";
      return `@${date.start}${dateEnd}${timeZone}`;
    }
    case "link_preview": {
      const linkPreview = mention.link_preview;
      return link(linkPreview.url, linkPreview.url);
    }
    case "template_mention": {
      return "";
    }
    case "database": {
      console.warn("[Warn] Database mention is not supported");
      return "";
    }
  }
  return "";
}
async function richText(
  textArray: RichTextItemResponse[],
  notion: Client
): Promise<string> {
  return (
    await Promise.all(
      textArray.map(async (text) => {
        if (text.type === "text") {
          return textRichText(text);
        } else if (text.type === "equation") {
          return equationRichText(text);
        } else if (text.type === "mention") {
          return await mentionRichText(text, notion);
        }
      })
    )
  ).join("");
}
function htmlVideo(url: string) {
  return `<video controls style="height:auto;width:100%;">\n  <source src="${url}">\n  <p>\n    Your browser does not support HTML5 video. Here is a\n    <a href="${url}" download="${url}">link to the video</a> instead.\n  </p>\n</video>`;
}
const video = (block: VideoBlockObjectResponse) => {
  const videoBlock = block.video;
  if (videoBlock.type === "file") {
    return htmlVideo(blockIdToApiUrl(block.id));
  }
  const url = videoBlock.external.url;
  if (url.startsWith("https://www.youtube.com/")) {
    const videoId = url.slice(-11);
    return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
  return htmlVideo(url);
};
const pdf = (block: PdfBlockObjectResponse) => {
  const pdfBlock = block.pdf;
  const url =
    pdfBlock.type === "file"
      ? blockIdToApiUrl(block.id)
      : pdfBlock.external.url;
  return `<embed src="${url}" type="application/pdf" style="width: 100%;aspect-ratio: 2/3;height: auto;" />`;
};
const audio = (block: AudioBlockObjectResponse) => {
  const audioBlock = block.audio;
  const url =
    audioBlock.type === "file"
      ? blockIdToApiUrl(block.id)
      : audioBlock.external.url;
  return `<audio controls src="${url}"></audio>`;
};
const md = {
  addTabSpace,
  image,
  divider,
  equation,
  video,
  pdf,
  link,
  table,
  toggle,
  heading1,
  heading2,
  heading3,
  bullet,
  todo,
  codeBlock,
  callout,
  quote,
  audio,
  richText,
};

/**
 * Converts a Notion page to Markdown.
 */
export class NotionToMarkdown {
  private notionClient: Client;
  private customTransformers: Record<string, CustomTransformer>;
  private richText: (textArray: RichTextItemResponse[]) => Promise<string>;
  private unsupportedTransformer: (type: string) => string = () => "";
  constructor(options: NotionToMarkdownOptions) {
    this.notionClient = options.notionClient;
    this.customTransformers = {};
    this.richText = (textArray: RichTextItemResponse[]) =>
      md.richText(textArray, this.notionClient);
  }
  setCustomTransformer(
    type: string,
    transformer: CustomTransformer
  ): NotionToMarkdown {
    this.customTransformers[type] = transformer;

    return this;
  }
  setCustomRichTextTransformer(
    transformer: (
      textArray: RichTextItemResponse[],
      notion: Client
    ) => Promise<string>
  ) {
    this.richText = (textArray: RichTextItemResponse[]) =>
      transformer(textArray, this.notionClient);
    return this;
  }
  setUnsupportedTransformer(transformer: (type: string) => string) {
    this.unsupportedTransformer = transformer;
    return this;
  }
  /**
   * Converts Markdown Blocks to string
   * @param {MdBlock[]} mdBlocks - Array of markdown blocks
   * @param {number} nestingLevel - Defines max depth of nesting
   * @returns {string} - Returns markdown string
   */
  toMarkdownString(mdBlocks: MdBlock[] = [], nestingLevel: number = 0): string {
    let mdString = "";
    mdBlocks.forEach((mdBlocks) => {
      // process parent blocks
      if (mdBlocks.parent) {
        if (
          mdBlocks.type !== "to_do" &&
          mdBlocks.type !== "bulleted_list_item" &&
          mdBlocks.type !== "numbered_list_item"
        ) {
          // add extra line breaks non list blocks
          mdString += `\n${md.addTabSpace(mdBlocks.parent, nestingLevel)}\n\n`;
        } else {
          mdString += `${md.addTabSpace(mdBlocks.parent, nestingLevel)}\n`;
        }
      }

      // process child blocks
      if (mdBlocks.children && mdBlocks.children.length > 0) {
        if (mdBlocks.type === "synced_block") {
          mdString += this.toMarkdownString(mdBlocks.children, nestingLevel);
        } else {
          mdString += this.toMarkdownString(
            mdBlocks.children,
            nestingLevel + 1
          );
        }
      }
    });
    return mdString;
  }

  /**
   * Retrieves Notion Blocks based on ID and converts them to Markdown Blocks
   * @param {string} id - notion page id (not database id)
   * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100 (Default=null)
   * @returns {Promise<MdBlock[]>} - List of markdown blocks
   */
  async pageToMarkdown(
    id: string,
    totalPage: number | null = null
  ): Promise<MdBlock[]> {
    if (!this.notionClient) {
      throw new Error(
        "notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md"
      );
    }

    const blocks = await getBlockChildren(this.notionClient, id, totalPage);

    const parsedData = await this.blocksToMarkdown(blocks);
    return parsedData;
  }

  /**
   * Converts list of Notion Blocks to Markdown Blocks
   * @param {ListBlockChildrenResponseResults | undefined} blocks - List of notion blocks
   * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100
   * @param {MdBlock[]} mdBlocks - Defines max depth of nesting
   * @returns {Promise<MdBlock[]>} - Array of markdown blocks with their children
   */
  async blocksToMarkdown(
    blocks?: GetBlockResponse[],
    totalPage: number | null = null,
    mdBlocks: MdBlock[] = []
  ): Promise<MdBlock[]> {
    if (!this.notionClient) {
      throw new Error(
        "notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md"
      );
    }

    if (!blocks) return mdBlocks;

    for (const block of blocks) {
      if (!isFullBlock(block)) continue;
      let expiry_time: string | undefined = undefined;
      if (block.type === "pdf" && block.pdf.type === "file") {
        expiry_time = block.pdf.file.expiry_time;
      }
      if (block.type === "image" && block.image.type === "file") {
        expiry_time = block.image.file.expiry_time;
      }
      if (block.type === "video" && block.video.type === "file") {
        expiry_time = block.video.file.expiry_time;
      }
      if (block.type === "file" && block.file.type === "file") {
        expiry_time = block.file.file.expiry_time;
      }

      if (
        block.has_children &&
        block.type !== "column_list" &&
        block.type !== "toggle" &&
        block.type !== "callout" &&
        block.type !== "quote"
      ) {
        let child_blocks = await getBlockChildren(
          this.notionClient,
          block.id,
          totalPage
        );

        mdBlocks.push({
          type: block.type,
          parent: await this.blockToMarkdown(block),
          children: [],
          expiry_time,
        });

        await this.blocksToMarkdown(
          child_blocks,
          totalPage,
          mdBlocks[mdBlocks.length - 1].children
        );
        continue;
      }
      let tmp = await this.blockToMarkdown(block);
      mdBlocks.push({
        type: block.type,
        parent: tmp,
        children: [],
        expiry_time,
      });
    }
    return mdBlocks;
  }


  /**
   * Converts a Notion Block to a Markdown Block
   * @param block - single notion block
   * @returns corresponding markdown string of the passed block
   */
  async blockToMarkdown(block: GetBlockResponse): Promise<string> {
    if (typeof block !== "object" || !("type" in block)) return "";
    const { type } = block;
    if (type in this.customTransformers && !!this.customTransformers[type])
      return await this.customTransformers[type](block);
    switch (type) {
      case "image": {
        const image = block.image;
        if (image.type === "external") {
          return md.image(plainText(image.caption), image.external.url);
        }
        return md.image(plainText(image.caption), blockIdToApiUrl(block.id));
      }
      case "divider": {
        return md.divider();
      }

      case "equation": {
        return md.equation(block.equation.expression);
      }

      case "video":
        return md.video(block);
      case "pdf":
        return md.pdf(block);
      case "file": {
        const file = block.file;
        const link =
          file.type === "external" ? file.external.url : blockIdToApiUrl(block.id);
        return md.link(file.name, link);
      }
      case "bookmark": {
        const bookmark = block.bookmark;
        const caption =
          bookmark.caption.length > 0
            ? await this.richText(bookmark.caption)
            : bookmark.url;
        return md.link(caption, bookmark.url);
      }

      case "link_to_page": {
        const linkToPage = block.link_to_page;
        if (linkToPage.type === "page_id") {
          const { title, relref } = await getPageRelrefFromId(
            linkToPage.page_id,
            this.notionClient
          );
          return md.link(title, relref);
        } else if (linkToPage.type === "comment_id") {
          console.warn("Unsupported link_to_page type: comment_id");
          return "";
        } else if (linkToPage.type === "database_id") {
          console.warn("Unsupported link_to_page type: database_id");
          return "";
        }
        break;
      }
      case "embed": {
        const embed = block.embed;
        const title = embed.caption.length > 0 ? plainText(embed.caption) : embed.url;
        return md.link(title, embed.url);
      }
      case "link_preview": {
        const linkPreview = block.link_preview;
        return md.link(linkPreview.url, linkPreview.url);
      }
      case "child_page":
      case "child_database":
        {
          let blockContent;
          let title: string = type;
          if (type === "child_page") {
            blockContent = { url: block.id };
            title = block.child_page.title;
          }

          if (type === "child_database") {
            blockContent = { url: block.id };
            title = block.child_database.title || "child_database";
          }

          if (blockContent) return md.link(title, blockContent.url);
        }
        break;

      case "table": {
        const { id, has_children } = block;
        let tableArr: string[][] = [];
        if (has_children) {
          const tableRows = await getBlockChildren(this.notionClient, id, 100);
          // console.log(">>", tableRows);
          let rowsPromise = tableRows?.map(async (row) => {
            const { type } = row as any;
            const cells = (row as any)[type]["cells"];

            /**
             * this is more like a hack since matching the type text was
             * difficult. So converting each cell to paragraph type to
             * reuse the blockToMarkdown function
             */
            let cellStringPromise = cells.map(
              async (cell: any) =>
                await this.blockToMarkdown({
                  type: "paragraph",
                  paragraph: { rich_text: cell },
                } as GetBlockResponse)
            );

            const cellStringArr = await Promise.all(cellStringPromise);
            // console.log("~~", cellStringArr);
            tableArr.push(cellStringArr);
            // console.log(tableArr);
          });
          await Promise.all(rowsPromise || []);
        }
        return md.table(tableArr);
      }

      case "column_list": {
        const { id, has_children } = block;

        if (!has_children) return "";

        const column_list_children = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        let column_list_promise = column_list_children.map(
          async (column) => await this.blockToMarkdown(column)
        );

        let column_list: string[] = await Promise.all(column_list_promise);

        return column_list.join("\n\n");
      }

      case "column": {
        const { id, has_children } = block;
        if (!has_children) return "";

        const column_children = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        const column_children_promise = column_children.map(
          async (column_child) => await this.blockToMarkdown(column_child)
        );

        let column: string[] = await Promise.all(column_children_promise);
        return column.join("\n\n");
      }

      case "toggle": {
        const { id, has_children } = block;

        const toggle_summary = block.toggle.rich_text[0]?.plain_text;

        // empty toggle
        if (!has_children) {
          return md.toggle(toggle_summary);
        }

        const toggle_children_object = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        // parse children blocks to md object
        const toggle_children = await this.blocksToMarkdown(
          toggle_children_object
        );

        // convert children md object to md string
        const toggle_children_md_string =
          this.toMarkdownString(toggle_children);

        return md.toggle(toggle_summary, toggle_children_md_string);
      }

      case "paragraph":
        return await this.richText(block.paragraph.rich_text);
      case "heading_1":
        return md.heading1(await this.richText(block.heading_1.rich_text));
      case "heading_2":
        return md.heading2(await this.richText(block.heading_2.rich_text));
      case "heading_3":
        return md.heading3(await this.richText(block.heading_3.rich_text));
      case "bulleted_list_item":
        return md.bullet(
          await this.richText(block.bulleted_list_item.rich_text)
        );
      case "numbered_list_item":
        return md.bullet(
          await this.richText(block.numbered_list_item.rich_text),
          1
        );
      case "to_do":
        return md.todo(
          await this.richText(block.to_do.rich_text),
          block.to_do.checked
        );
      case "code":
        return md.codeBlock(
          plainText(block.code.rich_text),
          block.code.language
        );
      case "callout":
        const { id, has_children } = block;
        const callout_text = await this.richText(block.callout.rich_text);
        if (!has_children) return md.callout(callout_text, block.callout.icon);

        let callout_string = "";

        const callout_children_object = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        // parse children blocks to md object
        const callout_children = await this.blocksToMarkdown(
          callout_children_object
        );

        callout_string += `${callout_text}\n`;
        callout_children.map((child) => {
          callout_string += `${child.parent}\n\n`;
        });

        return md.callout(callout_string.trim(), block.callout.icon);
      case "quote":
        const quote_text = await this.richText(block.quote.rich_text);
        if (!block.has_children) return md.quote(quote_text);
        let quote_string = "";
        const quote_children_object = await getBlockChildren(
          this.notionClient,
          block.id,
          100
        );
        const quote_children = await this.blocksToMarkdown(
          quote_children_object
        );

        quote_string += `${quote_text}\n`;
        quote_children.map((child) => {
          quote_string += `${child.parent}\n\n`;
        });

        return md.quote(quote_string.trim());

      case "audio":
        return md.audio(block);
      case "template":
      case "synced_block":
      case "child_page":
      case "child_database":
      case "column":
      case "link_preview":
      case "column_list":
      case "link_to_page":
      case "breadcrumb":
      case "unsupported":
      case "table_of_contents":
        return this.unsupportedTransformer(type);
    }
    return "";
  }
}
