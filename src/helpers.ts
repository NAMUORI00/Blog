import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";

export function getPageTitle(page: PageObjectResponse): string {
  const title = page.properties.Name ?? page.properties.title;
  if (title.type === "title") {
    return title.title.map((text) => text.plain_text).join("");
  }
  throw Error(
    `page.properties.Name has type ${title.type} instead of title. The underlying Notion API might has changed, please report an issue to the author.`,
  );
}

export async function getCoverLink(
  page_id: string,
  notion: Client,
): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id });
  if (!isFullPage(page) || page.cover === null) {
    return null;
  }
  return page.cover.type === "external"
    ? page.cover.external.url
    : pageIdToApiUrl(page_id);
}

export function getFileName(title: string, page_id: string): string {
  const sanitizedTitle = title
    .replace(/[\\/:*?"'<>|`]/g, "")
    .replaceAll(" ", "-")
    .replace(/--+/g, "-");
  const sanitizedId = page_id.replaceAll("-", "");
  return `${sanitizedTitle}-${sanitizedId}.md`;
}
