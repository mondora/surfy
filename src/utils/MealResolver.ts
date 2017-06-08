export function resolve (meal: any) {
    if (!meal) {
        return;
    }
    // TODO da migliorare con regex o altro
    switch (meal.entity.toLowerCase().trim()) {
        case "cena":
            return "Cena";
        case "pranzo":
            return "Pranzo";
        case "questa sera":
            return "Cena";
        case "stasera":
            return "Cena";
        case "mezzo giorno":
            return "Pranzo";
        default: return;
    }
}
