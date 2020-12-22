// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@constants/database';

const {CUSTOM_EMOJI} = MM_TABLES.SERVER;

/**  The CustomEmoji model describes all the custom emojis used in the Mattermost app */
export default class CustomEmoji extends Model {
    /** table (entity name) : CustomEmoji */
    static table = CUSTOM_EMOJI;

    constructor() {
        super();
        this.name = '';
    }

    /** name :  The custom emoji's name*/
    @field('name') name!: string;
}