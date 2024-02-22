export interface Story {
    id: Number,
    title: String,
    subtitle: String,
    plot: String,
    summary: String,
    privacy: String,
    medium: String,
    other_medium: String,
    owner: String
}

export const stories: Array<Story> = [
    {
        id: 1,
        title: "Hay Un Bicho En Mis Pantalones",
        subtitle: "Ayudame Por Favor",
        plot: `Un dia, Jorge se encontro en un dilema. Hay un bicho en sus pantalones. Pero eso no es todo. 
            Jorge pronto descubre que en lo profundo de su armario hay un montón de muchas cosas pequeñas diferentes. 
            A medida que invita a sus amigos a investigar, comienzan a encontrar muchas más 
            aperturas a un mundo fantástico al otro lado de algo. La buena noticia es que 
            son los primeros en descubrir algo nuevo. ¿Las malas noticias? 
            Todos los pantalones de Jorge están terminados.`,
        summary: "Ayudale por pavor. Son las pantalones mas favorita de el.",
        privacy: "public",
        medium: "Novella",
        other_medium: "Comic",
        owner: "Jorge Giovanna"
    },
    {
        id: 2,
        title: "Three Stars in a Pool of Many",
        subtitle: "A Journey of Many Nothings and a Bit of Everything",
        plot: `If she could leave this town, then she would. 19 year old Maxie looks out her window beyond the horizon, 
            wishing everyday for something to whisk her away. In her haze, she comes across a dial with 
            many foreign characters and what she presumes to be numbers. When she takes it home with her, 
            a sudden flash consumes her when she turns it a certain way. Gone is the background of her 
            past, but what's to come could be far more intriguing, far more colorful, and yet far more dangerous. 
            Can she survive the experience? And how will she go back? Will she even want to?`,
        summary: `Maxie Friedman has been stuck in the same town for almost 20 years. 
        She finally finds something that whisks her away, but what will become of her now?`,
        privacy: "private",
        medium: "Novel",
        other_medium: "Novella",
        owner: "Leah Peng"
    },
    {
        id: 3,
        title: "That's My Folder!",
        subtitle: "Return the folder!",
        plot: `Morning walks, coffee, and a languid after-work wallow on the couch. There's little escape for
            Nour in her abymssal 9-to-5 life. But since her parents tried to hard to get here, what right does
            she have to complain? She has friends, she has an education, and most of all, she has her routine.
            On her way to an annual budget review for her team, she accidentally dozes off on the bus, leaving
            her presentation materials leaking out of her bag. When she fully wakes, it's all gone, but her meeting
            is in 5 hours! How will she find relief now!? Join Nour as she investigates the wacky, zany events that
            still survive in real life as she breaks into a mad dash across the city to find out: Who took her folder!?`,
        summary: "Follow Nour on her adventure!",
        privacy: "public",
        medium: "Short Story",
        other_medium: "N/A",
        owner: "Asifa Sajid"
    },
];

export async function getStory(query?: Number | null){
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return stories.find((story)=> story.id === query);
}

export async function getStories(){
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return stories;
}