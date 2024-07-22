type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, destination: string) => void;

export { DestinationCallback, FilenameCallback };
