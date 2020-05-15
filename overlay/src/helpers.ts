export function findEnsNames(text: string): string[] {
    // ToDo: which characters are valid?
    // ToDo: UTS46 and nameprep
    return text.match(/[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.eth/gm) || [];
}