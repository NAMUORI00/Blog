import { UserConfig } from "./src/config"

const userConfig: UserConfig = {
    base_url: "https://blog.namuori.net",
    mount: {
        manual: false,
        page_url: 'https://namuori00.notion.site/218dcd44779f80a0b5fcc7cffbc88959',
        pages: [
            // {
            //     page_id: '<page_id>',
            //     target_folder: 'path/relative/to/content/folder'
            // }
            {
                page_id: '218dcd44779f81169bcedf9476baf73b',
                target_folder: '.'
            }
        ],
        databases: [
            // {
            //     database_id: '<database_id>',
            //     target_folder: 'path/relative/to/content/folder'
            // }
            {
                database_id: '218dcd44779f81ddbf93e4fadbccbfde',
                target_folder: 'posts'
            }
        ],
    }
}

export default userConfig;