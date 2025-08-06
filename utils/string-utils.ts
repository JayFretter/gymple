export function titleCase(str: string) : string {
    if (str.trim() === '')
        return str;

    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() +
            txt.substring(1).toLowerCase();
    });
}