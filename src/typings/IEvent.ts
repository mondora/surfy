interface IEvent {
    _id: string;
    type: string;
    title: string;
    subtitle: string;
    text: string;
    date: Date;
    duration: string;
    image: string;
    speakers: string[];
    products: string[];
    room: string;
    map: string;
}

export default IEvent;
