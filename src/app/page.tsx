"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from '../styles/page.module.css';
import { Question } from '@/types';
import { dummyQuestions, getRandomElement } from '@/utils';

const COUNTDOWN_TIMER_IN_SECONDS = 2;
const INITIAL_LIVES = 3;

// help function to play audio
const useAudio = (src: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        audioRef.current = new Audio(src);
    }, [src]);
    
    const play = useCallback(() => {
        audioRef.current?.play();
    }, []);
    
    return play;
};

const useGameLogic = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [timeoutTriggered, setTimeoutTriggered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIMER_IN_SECONDS);
    const [lives, setLives] = useState(INITIAL_LIVES);
    const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [animationKey, setAnimationKey] = useState(0);

    const correctAnswerSound = useAudio('/audio/correct-answer.wav');
    const wrongAnswerSound = useAudio('/audio/wrong-answer.wav');
    const gameOverSound = useAudio('/audio/game-over.wav');
    const restartSound = useAudio('/audio/restart.wav');
    const tickSound = useAudio('/audio/tick.wav');

    const startGame = useCallback(() => {
        setGameStarted(true);
        setGameOver(false);
        setTimeoutTriggered(false);
        setLives(INITIAL_LIVES);
        const initialQuestions = dummyQuestions.filter(q => !q.answered);
        setRemainingQuestions(initialQuestions);
        setCurrentQuestion(getRandomElement(initialQuestions));
    }, []);

    const getNextQuestion = useCallback((updatedQuestions: Question[]) => {
        const newRemainingQuestions = updatedQuestions.filter(q => !q.answered && !q.timedOut);

        if (newRemainingQuestions.length > 0) {
            setRemainingQuestions(newRemainingQuestions);
            setCurrentQuestion(getRandomElement(newRemainingQuestions));
            setAnimationKey(prev => prev + 1);
            setTimeoutTriggered(false);
        } else {
            setCurrentQuestion(null);
            setGameOver(true);
            gameOverSound();
        }
    }, [gameOverSound]);

    const handleTimeOut = useCallback(() => {
        const updatedLives = lives - 1;
        setLives(updatedLives);

        if (updatedLives <= 0) {
            if (!gameOver) gameOverSound();
            setGameOver(true);
        } else if (currentQuestion) {
            const updatedQuestions = remainingQuestions.map(q =>
                q.id === currentQuestion.id ? { ...q, timedOut: true } : q
            );
            setTimeoutTriggered(true);
            setTimeout(() => getNextQuestion(updatedQuestions), 1000);
        }

        setTimeLeft(COUNTDOWN_TIMER_IN_SECONDS);
        if (!gameOver) wrongAnswerSound();
    }, [lives, gameOver, currentQuestion, remainingQuestions, getNextQuestion, wrongAnswerSound, gameOverSound]);

    const handleAnswerClick = useCallback((selectedAnswerName: string) => {
        if (currentQuestion) {
            const updatedAnswers = currentQuestion.answers.map(answer => {
                if (answer.name === selectedAnswerName) {
                    return { ...answer, count: answer.count + 1, chosen: answer.chosen + 1 };
                }
                return { ...answer, count: answer.count + 1 };
            });

            const updatedQuestion = { ...currentQuestion, answers: updatedAnswers, answered: true, timedOut: false };

            const updatedQuestions = remainingQuestions.map(q =>
                q.id === currentQuestion.id ? updatedQuestion : q
            );

            getNextQuestion(updatedQuestions);
            setTimeLeft(COUNTDOWN_TIMER_IN_SECONDS);
            correctAnswerSound();
        }
    }, [currentQuestion, remainingQuestions, getNextQuestion, correctAnswerSound]);

    const resetGame = useCallback(() => {
        restartSound();
        setGameOver(false);
        setGameStarted(false);
        setTimeLeft(COUNTDOWN_TIMER_IN_SECONDS);
        setLives(INITIAL_LIVES);
        setRemainingQuestions([]);
        setCurrentQuestion(null);
    }, [restartSound]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (gameStarted && !gameOver) {
            if (timeLeft+1 > 0) {
                timer = setTimeout(() => {
                    setTimeLeft(prev => prev - 1);
                    if (timeLeft > 0) {
                        tickSound();
                    }
                }, 1000);
            } else {
                handleTimeOut();
            }
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timeLeft, gameStarted, gameOver, tickSound, handleTimeOut]);

    return {
        gameStarted,
        gameOver,
        timeoutTriggered,
        timeLeft,
        lives,
        currentQuestion,
        animationKey,
        startGame,
        handleAnswerClick,
        resetGame,
        renderHearts: () => {
            return Array.from({ length: INITIAL_LIVES }).map((_, i) => (
                <img
                    key={i}
                    src={i < lives ? "/imgs/heart-full.png" : "/imgs/heart-empty.png"}
                    alt="Heart Icon"
                    className={styles.heartIcon}
                />
            ));
        }
    };
};

const GamePage: React.FC = () => {
    const {
        gameStarted,
        gameOver,
        timeoutTriggered,
        timeLeft,
        currentQuestion,
        animationKey,
        startGame,
        handleAnswerClick,
        resetGame,
        renderHearts,
    } = useGameLogic();

    return (
        <div className={styles.container}>
            {!gameStarted && !gameOver && (
                <div className={styles.startOverlay} onClick={startGame}>
                    <h1 className={styles.startText}>Click to Start</h1>
                </div>
            )}

            {gameOver ? (
                <div className={styles.gameOver}>
                    <h1>Game Over!</h1>
                    <button onClick={resetGame} className={styles.restartButton}>Restart Game</button>
                </div>
            ) : (
                <>
                    <div className={styles.livesSection}>
                        {renderHearts()}
                    </div>

                    <div className={styles.timerSection}>
                        <img
                            src="/imgs/alarm-icon.png"
                            alt="Timer Icon"
                            className={styles.icon}
                        />
                        <div className={styles.progressBarContainer}>
                            <div
                                className={styles.progressBar}
                                style={{ width: `${((timeLeft / COUNTDOWN_TIMER_IN_SECONDS)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className={styles.questionSection}>
                        {currentQuestion ? (
                            <>
                                <h2 className={styles.questionPremise}>{currentQuestion.premise}</h2>
                                <div className={styles.optionsContainer}>
                                    {currentQuestion.answers.map((answer, index) => (
                                        <React.Fragment key={`${animationKey}-${index}`}>
                                            <div
                                                className={`${styles.optionBox} ${index === 0 ? styles.optionBoxLeft : styles.optionBoxRight} ${timeoutTriggered ? styles.optionBoxTimeout : ''}`}
                                                onClick={() => handleAnswerClick(answer.name)}
                                            >
                                                {answer.name}
                                            </div>
                                            {index < currentQuestion.answers.length - 1 && (
                                                <div className={styles.orText}>or</div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.orText}>No more questions available</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GamePage;
