import {Survey} from './survey';

export interface Folder {
    _id?: string;
    isRoot: boolean;
    title: string;
    folders?: [Folder];
    surveys?: [Survey];
    open?: boolean;
}
