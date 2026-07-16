import { useEffect, useReducer } from 'react'
import { reducer, initialState } from './game/reducer'
import { SetupScreen } from './screens/SetupScreen'
import { ReadyScreen } from './screens/ReadyScreen'
import { PlayScreen } from './screens/PlayScreen'
import { RoundEndScreen } from './screens/RoundEndScreen'
import { FinalScreen } from './screens/FinalScreen'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Timer hidup di sini, bukan di dalam reducer — biar reducer tetap fungsi
  // murni dan bisa dites tanpa fake timer.
  useEffect(() => {
    if (state.phase !== 'playing') return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.phase])

  switch (state.phase) {
    case 'setup':
      return (
        <SetupScreen
          onStart={(teamNames, config) => dispatch({ type: 'START_SESSION', teamNames, config })}
        />
      )

    case 'ready':
      return (
        <ReadyScreen
          team={state.teams[state.currentTeamIndex]}
          roundNumber={state.currentTeamIndex + 1}
          totalTeams={state.teams.length}
          onStart={() => dispatch({ type: 'START_ROUND' })}
        />
      )

    case 'playing':
      return state.currentCard ? (
        <PlayScreen
          card={state.currentCard}
          timeLeft={state.timeLeft}
          cardsPlayed={state.cardsPlayed}
          maxCards={state.config.maxCards}
          roundScore={state.roundScore}
          onPass={() => dispatch({ type: 'PASS' })}
          onCorrect={() => dispatch({ type: 'CORRECT' })}
        />
      ) : null

    case 'roundEnd':
      return (
        <RoundEndScreen
          team={state.teams[state.currentTeamIndex]}
          roundScore={state.roundScore}
          isLastTeam={state.currentTeamIndex === state.teams.length - 1}
          onNext={() => dispatch({ type: 'NEXT_TEAM' })}
        />
      )

    case 'finished':
      return <FinalScreen teams={state.teams} onRestart={() => dispatch({ type: 'RESET' })} />
  }
}
