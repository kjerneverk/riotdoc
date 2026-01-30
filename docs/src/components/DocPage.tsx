import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import MarkdownRenderer from './MarkdownRenderer'

interface DocPageProps {
    docSections: any[];
}

const DocPage = ({ docSections }: DocPageProps) => {
    const { slug } = useParams<{ slug: string }>()
    const [content, setContent] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Handle home route (slug is undefined) -> getting-started
    // Handle invalid slug -> 404 or redirect? We'll show error for now.
    const sectionId = slug || 'getting-started'
    const section = docSections.find(s => s.id === sectionId)

    useEffect(() => {
        if (!section) {
            setLoading(false)
            return // Will render error/redirect below
        }

        const fetchContent = async () => {
            setLoading(true)
            setError(null)
            try {
                // Use absolute path from base to ensure it works with BrowserRouter
                const basePath = import.meta.env.BASE_URL || '/';
                const response = await fetch(`${basePath}${section.file}`)
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${section.title}: ${section.file} (Status: ${response.status})`)
                }
                const text = await response.text()
                setContent(text)
                setLoading(false)
                window.scrollTo(0, 0)
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Unknown error')
                setLoading(false)
            }
        }

        fetchContent()
    }, [section])

    if (!section) {
        return <Navigate to="/" replace />
    }

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <ErrorMessage message={error} />
            </div>
        )
    }

    return <MarkdownRenderer content={content} />
}

export default DocPage
