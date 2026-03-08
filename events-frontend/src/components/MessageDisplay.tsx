interface MessageProps {
  message: string;
  marginTop?: string;
}

export function MessageDisplay({ message, marginTop = '20px' }: MessageProps) {
  if (!message) return null;

  const isSuccess = message.toLowerCase().includes('success');

  return (
    <p
      style={{
        color: isSuccess ? 'green' : 'red',
        marginTop,
      }}
    >
      {message}
    </p>
  );
}
