interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="error-message">
            <h2>Error</h2>
            <p>{message}</p>
            <p>Please try refreshing the page or check back later.</p>
        </div>
    )
}
