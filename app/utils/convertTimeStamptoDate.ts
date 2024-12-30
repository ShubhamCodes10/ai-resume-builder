export const convertTimestampToDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000;
    return new Date(milliseconds);
  };

