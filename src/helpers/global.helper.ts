export const capitalizeFirstLetter = (string: string) => {
    const words = string.split(" ").map((word) => word.trim());
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    return words.join(" ");
};