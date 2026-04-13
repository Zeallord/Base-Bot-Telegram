require('../config/setting'); // supaya global.ID_OWNER_BOT dan global.ID_ADMIN_BOT bisa dipakai

async function isOwner(ctx) {
    return ctx.from.id.toString() === global.ID_OWNER_BOT.toString();
}

async function isAdmin(ctx) {
    /* Cek jika user ID ada di list ADMIN_BOT */
    return global.ID_ADMIN_BOT.includes(ctx.from.id.toString());
}

async function isPrivate(ctx) {
    return ctx.chat.type === 'private';
}

async function isGroup(ctx) {
    return ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';
}

async function isGroupAdmin(ctx) {
    if (!ctx.chat || !ctx.chat.id || ctx.chat.type === 'private') {
        return false;
    }

    try {
        const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
        return ['administrator', 'creator'].includes(member.status);
    } catch (err) {
        console.error('Error checking group admin:', err);
        return false;
    }
}

module.exports = {
    isOwner,
    isAdmin,
    isPrivate,
    isGroup,
    isGroupAdmin
};
