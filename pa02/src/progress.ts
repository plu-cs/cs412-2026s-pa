import process from 'node:process';
import {styleText} from "node:util";

class Progress {

    barWidth = 50;
    totalCount;
    count = 0;
    startTime = 0;

    constructor( count : number ) {
        this.totalCount = count;
        this.startTime = performance.now();
    }

    finished() : void {
        const endTime = performance.now();
        this.count = this.totalCount;

        const totalTimeMs = endTime - this.startTime;
        const s = this.formatTime(totalTimeMs);

        this.drawProgressBar(false);
        console.log(` ${s}`);
    }

    // Drawing the Progress Bar Image
    drawProgressBar(showPct : boolean = true ) : void  {
        const progressPct = this.count / this.totalCount;
        process.stdout.cursorTo(0);

        const filledWidth = Math.floor(progressPct * this.barWidth);
        const emptyWidth = this.barWidth - filledWidth;
        const progressBar = styleText(['green'],'█'.repeat(filledWidth)) + '▒'.repeat(emptyWidth);
        process.stdout.write(`[${progressBar}]`);
        if( showPct ) {
            process.stdout.write(` ${(progressPct * 100).toFixed(1)}%`);

            const elapsed = performance.now() - this.startTime;
            const expected = elapsed / progressPct;
            process.stdout.write( `  [${this.formatTime(elapsed)}/${this.formatTime(expected)}]`);
        }
        process.stdout.clearLine(1);
    }

    inc( amount : number = 1 ) {
        this.count += amount;
        this.drawProgressBar();
    }

    formatTime( timeMs : number ) : string {
        const pad2 = (num: number): string => {
            return num.toString().padStart(2, '0');
        };

        const seconds = Math.floor(timeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        let s= "";
        if( minutes === 0 ) {
            s = `${(timeMs / 1000).toFixed(2)}s`;
        } else if( hours === 0 ) {
            s = `${minutes}:${pad2(seconds % 60)}`;
        } else if( days === 0 ) {
            s = `${hours}:${pad2(minutes % 60)}:${pad2(seconds % 60)}`;
        } else {
            s = `${days}d, ${hours % 24}:${pad2(minutes % 60)}:${pad2(seconds % 60)}`;
        }
        return s;
    }
}

export default Progress;