import {
    useEffect, useRef, useLayoutEffect, useState,
} from 'react';
import * as d3 from 'd3';
import styles from './OverallScore.module.css';

export const OverallScore = ({ score }) => {
    console.log(score);
    const progressBarRef = useRef(null);
    const svgCircleRef = useRef(null);
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [progressBarHeight, setprogressBarHeight] = useState(0);
    const [circleCircumference, setcircleCircumference] = useState(0);
    const [progressBarFillLength, setprogressBarFillLength] = useState(0);
    useLayoutEffect(() => {
        if (progressBarRef.current) {
            const { height, width } = progressBarRef.current.getBoundingClientRect();
            setProgressBarWidth(width);
            setprogressBarHeight(height);
        }
    }, []);

    useEffect(() => {
        if (svgCircleRef?.current) {
            setcircleCircumference(svgCircleRef.current.getTotalLength());
            setprogressBarFillLength(circleCircumference * score);
        }
    }, [svgCircleRef]);

    /*   useEffect(() => {
        setprogressBarFillLength(circleCircumference * score);
    }, [circleCircumference, score]); */

    console.log('progressBarFillLenght', progressBarFillLength, 'circlecircumference', circleCircumference, 'score', score);

    return (
        <div className={styles.overallScoreContainer}>
            <div className={styles.contentContainer} ref={progressBarRef}>
                <span className={styles.title}>Score</span>
                <div className={styles.scoreTextContainer} style={{ width: progressBarWidth * 0.15 }}>
                    <span className={styles.scoreNumber}>
                        {score * 100}
                        %
                    </span>
                    <span className={styles.text}>
                        de votre objectif
                    </span>
                </div>
                <svg className={styles.progressBarContainer}>
                    <circle
                        id="border-track"
                        className={`${styles.borderTrack} ${styles.progressBarItem}`}
                        cx={progressBarWidth / 2}
                        cy={progressBarHeight / 2}
                        r={Math.min(progressBarWidth, progressBarHeight) / 2.5}
                    />
                    <circle
                        id="track"
                        className={`${styles.track} ${styles.progressBarItem}`}
                        cx={progressBarWidth / 2}
                        cy={progressBarHeight / 2}
                        r={Math.min(progressBarWidth, progressBarHeight) / 2.5}
                    />
                    {/* <circle className={`${styles.progressBorder} ${styles.progressBarItem}`} cx={progressBarWidth / 2} cy={progressBarHeight / 2} r={Math.min(progressBarWidth, progressBarHeight) / 2.5}
 /> */}
                    <circle
                        ref={svgCircleRef}
                        className={`${styles.progress} ${styles.progressBarItem}`}
                        cx={progressBarWidth / 2}
                        cy={progressBarHeight / 2}
                        r={Math.min(progressBarWidth, progressBarHeight) / 2.5}

                        style={{
                            strokeDasharray: `${progressBarFillLength} ${circleCircumference}`,
                            strokeDashoffset: circleCircumference - progressBarFillLength,
                        }}
                    />
                </svg>
                {/* <svg className={styles.progressBarContainer}>
                    <circle id="track" className={`${styles.circleTest} ${styles.progressBarItem}`} cx={progressBarWidth / 2} cy={progressBarHeight / 2} r={Math.min(progressBarWidth, progressBarHeight) / 2.5}
 style={{ strokeDasharray: `${score * 100}% ${(1 - score) * 100}% ` }} />
                </svg> */}
            </div>
        </div>
    );
};
