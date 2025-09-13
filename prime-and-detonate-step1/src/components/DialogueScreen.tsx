import React from 'react';
import type { AppState, DialogueState, ChoiceOption } from '../game/types';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function DialogueScreen({ state, setState }: Props) {
  const dialogue = state.dialogue!;
  const currentLine = dialogue.script[dialogue.index];

  const handleContinue = () => {
    if (dialogue.index < dialogue.script.length - 1) {
      setState(state => ({
        dialogue: {
          ...state.dialogue!,
          index: state.dialogue!.index + 1
        }
      }));
    } else {
      // Dialogue complete, go to battle
      setState({ screen: 'battle' });
    }
  };

  const handleChoice = (choice: ChoiceOption) => {
    setState(state => ({
      dialogue: {
        ...state.dialogue!,
        stars: state.dialogue!.stars + (choice.star ? 1 : 0),
        index: state.dialogue!.index + 1
      }
    }));
  };

  const handleSkip = () => {
    setState({ screen: 'battle' });
  };

  const renderDialogueLine = () => {
    if (!currentLine) return null;

    if ('type' in currentLine && currentLine.type === 'choice') {
      return (
        <div className="choice-wrap">
          <div className="choice-card">
            <div className="choice-title">{currentLine.title}</div>
            <div className="choice-list">
              {currentLine.options.map((choice, index) => (
                <button
                  key={index}
                  className="btn"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="dlg-bubble-row">
        <div className="dlg-bubble">
          <div className="dlg-speaker">{'speaker' in currentLine ? currentLine.speaker : ''}</div>
          <div className="dlg-text">{'text' in currentLine ? currentLine.text : ''}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .dialogue-screen {
            display: grid;
            position: relative;
            grid-template-rows: auto 1fr auto;
            height: 100dvh;
            max-width: 480px;
            margin: 0 auto;
            background-color: #0b1220;
            color: #e5e7eb;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: auto 100dvh;
          }
          
          .dlg-hud {
            position: relative;
            z-index: 5;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          
          .dlg-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 16px;
            pointer-events: auto;
          }
          
          .dlg-stars {
            font-size: 24px;
            color: #fbbf24;
          }
          
          .dlg-skip {
            display: flex;
            justify-content: flex-end;
          }
          
          .dlg-skip .btn {
            background: rgba(220, 38, 38, 0.2);
            border: 1px solid rgba(220, 38, 38, 0.5);
            color: #fca5a5;
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: 600;
            transition: all 0.2s ease;
            cursor: pointer;
          }
          
          .dlg-skip .btn:hover {
            background: rgba(220, 38, 38, 0.3);
            border-color: rgba(220, 38, 38, 0.7);
          }
          
          .dlg-scene {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: end;
            gap: 8px;
            padding: 12px;
            height: 100%;
          }
          
          .dlg-bubble-row {
            grid-column: 1 / -1;
            display: flex;
            gap: 8px;
            align-items: flex-end;
            justify-content: space-between;
            padding-bottom: 200px;
          }
          
          .dlg-bubble {
            max-width: 75%;
            background: rgba(30, 41, 59, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.25);
            border-radius: 12px;
            padding: 10px;
          }
          
          .dlg-speaker {
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 4px;
            color: #93c5fd;
          }
          
          .dlg-text {
            font-size: 14px;
            line-height: 1.25;
          }
          
          .choice-wrap {
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: calc(env(safe-area-inset-bottom, 12px) + 200px);
            display: flex;
            align-items: flex-end;
            justify-content: center;
            background: transparent;
            pointer-events: none;
          }
          
          .choice-card {
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(148, 163, 184, 0.3);
            border-radius: 12px;
            padding: 12px;
            max-width: 420px;
            width: 90%;
            pointer-events: auto;
          }
          
          .choice-title {
            font-weight: 800;
            margin-bottom: 8px;
          }
          
          .choice-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .choice-list .btn {
            white-space: normal;
            word-wrap: break-word;
            text-align: left;
            min-height: 44px;
            line-height: 1.3;
            padding: 12px;
            background: #374151;
            border: 1px solid #4b5563;
            color: #f8fafc;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .choice-list .btn:hover {
            background: #4b5563;
          }
          
          .tap-area {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 50%;
            opacity: 0;
            z-index: 4;
            cursor: pointer;
          }
        `}
      </style>
      <div className="dialogue-screen">
        <div className="dlg-hud">
          <div className="dlg-header">
            <div className="dlg-stars">
              {'★'.repeat(dialogue.stars)}
            </div>
            <div className="dlg-skip">
              <button className="btn" onClick={handleSkip}>
                Skip
              </button>
            </div>
          </div>
        </div>
        
        <div className="dlg-scene">
          {renderDialogueLine()}
        </div>
        
        <div className="tap-area" onClick={handleContinue} aria-label="Advance" />
      </div>
    </>
  );
}
