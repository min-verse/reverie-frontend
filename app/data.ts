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

export interface Character {
    id: Number,
    storyId: Number,
    name: String,
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
    {
        id: 4,
        title: "If This Be the End",
        subtitle: "Look past the omega",
        plot: `In the beginning there was light. Then after that, the dark. Well, not that fast. Millions of years
                passed before the universe cooled to a point of forming distinct structures like galaxies and it wouldn't
                be for another few billion years before we humans were even a concept. But then after that, what lies
                beyond the death of the universe. Let's peek into the future by following these post-human species.`,
        summary: "Peer past the looking glass of the life of the universe",
        privacy: "public",
        medium: "Novella",
        other_medium: "N/A",
        owner: "Sasha Asimov"
    },
    {
        id: 5,
        title: "Shanghai Shenanigans",
        subtitle: "In this city of East meets West, where will Xu find his way",
        plot: `Xu Tang is the best at what he does: winging it. So when his parents decide to
            teach him a lesson by sending him to Shanghai, he thought he could get by just fine
            without a plan. However fate had something else in store for him as he runs into
            Xiao Long who drags him into a world of mischief and...the divine!?`,
        summary: "Xu Tang lands himself in Shanghai amongst the ancient divine",
        privacy: "private",
        medium: "Novel",
        other_medium: "N/A",
        owner: "Li Pao"
    },
];

const characters: Array<Character> = [
    {
        id:1,
        storyId:1,
        name: 'Jorge Castillo'
    },
    {
        id:2,
        storyId:1,
        name: 'La Morena'
    },
    {
        id:3,
        storyId:1,
        name: 'Maria Lopez'
    },
    {
        id:4,
        storyId:2,
        name: 'Maxie Unova'
    },
    {
        id:5,
        storyId:2,
        name: 'Patty Unova'
    },
    {
        id:6,
        storyId:2,
        name: 'Jeremy Alwine'
    },
    {
        id:7,
        storyId:3,
        name: 'Nour Sajid'
    },
    {
        id:8,
        storyId:3,
        name: 'Gui Lee'
    },{
        id:9,
        storyId:3,
        name: 'Mansherry Frank'
    },
    {
        id:10,
        storyId:2,
        name: 'Richard Wright'
    },
    {
        id:11,
        storyId:2,
        name: 'Leonard Kline'
    },
    {
        id:12,
        storyId:3,
        name: 'Ritwik Biswas'
    },
    {
        id:13,
        storyId:3,
        name: 'Joey Tran'
    },
    {
        id:14,
        storyId:1,
        name: 'Juan Reyes'
    },
    {
        id:15,
        storyId:2,
        name: 'Jake Bryan'
    },
]

export async function getStory(query?: Number | null){
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const story = stories.find((story)=> story.id === query);
    if(!story){
        throw new Response("Not Found", { status: 404 });
    }
    return { ...story, characters: await getCharacters(query) }
}

export async function getStories(){
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return stories;
}

export async function getCharacters(query?: Number | null){
    await new Promise((resolve) => setTimeout(resolve, 100));
    const story = stories.find((story)=> story.id === query);
    if(!story){
        throw new Response("Not Found", { status: 404 });
    }
    return characters.filter((character)=> character.storyId === story.id);
}