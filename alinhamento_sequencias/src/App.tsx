import React, { useState } from 'react';
import './styles/App.css';
import AuthCodeInput from './AuthCodeInput';

interface AlignmentResult {
  sequencia1: string;
  sequencia2: string;
  score: number;
  matches: number;
  mismatches: number;
  gaps: number;
}

function needlemanWunsch(seq1: string, seq2: string): AlignmentResult {
  const matchScore = 1;
  const mismatchScore = -1;
  const gapScore = -1;

  const n = seq1.length;
  const m = seq2.length;

  // Initialize the score matrix
  const scoreMatrix: number[][] = [];
  for (let i = 0; i <= n; i++) {
    scoreMatrix[i] = new Array(m + 1);
    scoreMatrix[i][0] = i * gapScore;
  }
  for (let j = 0; j <= m; j++) {
    scoreMatrix[0][j] = j * gapScore;
  }

  // Fill the score matrix
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const match = scoreMatrix[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchScore);
      const deleteGap = scoreMatrix[i - 1][j] + gapScore;
      const insertGap = scoreMatrix[i][j - 1] + gapScore;
      scoreMatrix[i][j] = Math.max(match, deleteGap, insertGap);
    }
  }

  // Trace back to find the aligned sequences
  let sequencia1 = '';
  let sequencia2 = '';
  let i = n;
  let j = m;
  let matches = 0;
  let mismatches = 0;
  let gaps = 0;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && scoreMatrix[i][j] === scoreMatrix[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? matchScore : mismatchScore)) {
      sequencia1 = seq1[i - 1] + sequencia1;
      sequencia2 = seq2[j - 1] + sequencia2;
      if (seq1[i - 1] === seq2[j - 1]) {
        matches++;
      } else {
        mismatches++;
      }
      i--;
      j--;
    } else if (i > 0 && scoreMatrix[i][j] === scoreMatrix[i - 1][j] + gapScore) {
      sequencia1 = seq1[i - 1] + sequencia1;
      sequencia2 = '-' + sequencia2;
      gaps++;
      i--;
    } else {
      sequencia1 = '-' + sequencia1;
      sequencia2 = seq2[j - 1] + sequencia2;
      gaps++;
      j--;
    }
  }

  const alignmentResult: AlignmentResult = {
    sequencia1,
    sequencia2,
    score: scoreMatrix[n][m],
    matches,
    mismatches,
    gaps,
  };

  return alignmentResult;
}

function App() {
  const [code1, setCode1] = useState<string[]>(Array(6).fill(''));
  const [code2, setCode2] = useState<string[]>(Array(6).fill(''));
  
  const handleCode1Change = (newCode: string[]) => {
    setCode1(newCode);
  };

  const handleCode2Change = (newCode: string[]) => {
    setCode2(newCode);
  };

  return (
    <div className="App">
      <h1 className='title'>Alinhamento de Sequências</h1>
      <div className="container">
        <div className="code">
          <h2>Texto 1: </h2>
          <AuthCodeInput inputCode={code1} onCodeChange={handleCode1Change} />
        </div>
        <div className="code">
          <h2>Texto 2: </h2>
          <AuthCodeInput inputCode={code2} onCodeChange={handleCode2Change} />
        </div>
        <div className="result">
          <h3>Resultados</h3>
          {
            Object.entries(needlemanWunsch(code1.join(''), code2.join(''))).map(([key, value]) => (
            <>
            <p className="label" key={key}>
              <strong>{key}:</strong> <span>{value}</span>
            </p>
            </>
            ))
          }
        </div>
      </div>
    </div>
  );
} 

export default App;
