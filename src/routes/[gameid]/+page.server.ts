import { pb } from '$lib/pocketbase';
import { BidGame } from '$lib/Bid';

export const load: any = async ({ params }: any) => {
  const record = await pb.collection("boards").getOne(params.gameid);
  const playerIDs: string[] = record.participants;
  const creator: string = record.creator
  const state =  new BidGame(playerIDs).deck;
  
  return {
      title: `Game: ${params.gameid}`,
      id: params.gameid,
      players: playerIDs,
      gameState: state,
      creator: creator,
  };
};
async function getPlayers(id: string) {
  const record = await pb.collection("boards").getOne(id);
  return record.participants;
}