type s = "s"|"c"|"h"|"d";
let suits: s[] = ["s", "c", "h", "d"]
type v = "A"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"10"|"J"|"Q"|"K";
let values: v[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
let valueRanks = {"2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "j": 10, "q": 11, "k": 12, "a": 13};
let deck: { suit: s; value: v; }[] = [];
values.forEach(v=>{
    suits.forEach((s)=>{
        deck.push({"suit": s, "value": v});
    })
});


export class BidGame{
    players: string[];
    deck: { suit: s; value: v; }[];
    constructor(players: string[]){
        this.players = players;
        this.deck = [];
        for (let i = 0; i < players.length*6; i++){
            this.deck.push(deck.splice(Math.floor(Math.random()*deck.length),1)![0])
        }
    }    
}
