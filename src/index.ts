import * as fs from 'node:fs/promises';
import path from 'path';


/**
     * returns an shortened version of the path - relative path
     * @param fullPath - The full path to the file or directory.
     */

function GetRelativePath(fullPath: string){
    const rootDirPath = process.cwd();
    const rootDirArr = rootDirPath.split(path.sep);
    // The path separator is not consistent for different OS. It is safer to use path.sep
    const rootDir = rootDirArr[rootDirArr.length - 1];
    const strA = `~${path.sep}`;
    const strB = fullPath.split(`${rootDir}${path.sep}`)[1];
    const relativePath = strA + strB;
    return relativePath;
    }

interface ScanStats {
    filesScanned: number;
    directoriesScanned: number;
    hiddenFilesSkipped: number;
}

// Class to log necessary information from scan
class ScanLogger {
    stats: ScanStats = {
        filesScanned: 0,
        directoriesScanned: 0,
        hiddenFilesSkipped: 0
    };

    /**
     * Logs a scanned file path and increments the file counter.
     * @param filePath - The relative path to the file.
     */
    logFile(filePath: string) {
        this.stats.filesScanned++;
        console.log(`[File] ${filePath}`);
    }

    /**
     * Logs a scanned directory path and increments the directory counter.
     * @param dirPath - The full path to the directory.
     */
    logDirectory(dirPath: string) {
        this.stats.directoriesScanned++;
        const relPath = GetRelativePath(dirPath);

        console.log(`[Directory] ${relPath}`);
    }

    /**
     * Logs that a hidden file was skipped and increments the hidden file counter.
     * @param file - The name of the hidden file.
     */
    skipHidden(file: string) {
        this.stats.hiddenFilesSkipped++;
        console.log(`[Skipped Hidden] ${file}`);
    }

    /**
     * Prints a summary of all scan statistics to the console.
     */
    printSummary() {
        console.log(`\n Scan Summary:`);
        console.log(`------------------------`);
        console.log(`Files scanned:        ${this.stats.filesScanned}`);
        console.log(`Directories scanned:  ${this.stats.directoriesScanned}`);
        console.log(`Hidden files skipped: ${this.stats.hiddenFilesSkipped}`);
    }
}

class DirectoryScanner {
    _directoryList: string[];
    _logger: ScanLogger;

    /**
     * Initializes a new instance of the DirectoryScanner class.
     * @param directoryList - An array of directory paths to scan.
     * @param logger - A logger instance to handle scan logging and stats.
     */
    constructor(directoryList: Array<string>, logger: ScanLogger) {
        this._directoryList = directoryList;
        this._logger = logger; // Introduces the scanLogger class with dependency injection
    }

    /**
     * Recursively scans a directory, logs files and subdirectories.
     * Skips hidden files and uses the logger to track progress.
     * 
     * @param directoryPath - The path of the directory to scan.
     */
    async GetFiles(directoryPath: string) {
        try {
            const files = await fs.readdir(directoryPath);
            this._logger.logDirectory(directoryPath);

            for (let file of files) {
                // Skip hidden files
                if (file.startsWith('.')) {
                    this._logger.skipHidden(file);
                    continue;
                }

                const fullPath = path.join(directoryPath, file);

                if (await this.IsDirectory(fullPath)) {
                    await this.GetFiles(fullPath); // Recursive call when a directory is seen
                } else {
                    const relativePath = GetRelativePath(fullPath);
                    this._logger.logFile(relativePath);
                }
            }
        } catch (error: any) {
            console.log(error.message ?? error);
        }
    }

    /**
     * Determines whether a given path is a directory.
     * @param path - The path to check.
     * @returns True if it's a directory, false if it's a file or invalid.
     */
    async IsDirectory(path: string): Promise<boolean> {
        try {
            const stats = await fs.stat(path);
            return stats.isDirectory(); // Returns true if directory
        } catch (error: any) {
            console.log(`Stat failed for ${path}: ${error.message ?? error}`);
            return false;
        }
    }

    /**
     * Initiates the scanning process over all provided directories
     * and prints a summary upon completion.
     */
    async scanDirectory() {
        for (let directoryPath of this._directoryList) {
            await this.GetFiles(directoryPath);
        }

        this._logger.printSummary(); 
    }
}

// Define the list of directories or files to scan

const directoryPathArr: string[] = [
    "/Users/mac/Desktop/directory_scanner/directoryToScan1",
    "/Users/mac/Desktop/directory_scanner/directoryToScan2"
];

// const directoryPathArr: string[] = ["/Users/mac/Desktop/directory_scanner/src/index.ts"];//Error handling

const logger = new ScanLogger();
const directoryScanner = new DirectoryScanner(directoryPathArr, logger);
directoryScanner.scanDirectory();
 

