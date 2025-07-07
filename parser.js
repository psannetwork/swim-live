function parseRaceResults(data) {
  return data.map(entry => ({
    rank: entry.rank,
    name: entry.swimmer_name,
    team: entry.entry_group_name1,
    time: entry.result_time,
    reactionTime: entry.reaction_time,
    lap50: entry.lap50,
    lap100: entry.lap100,
    lap150: entry.lap150,
    lap200: entry.lap200
  }));
}

module.exports = { parseRaceResults };