import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbsProps {
    docSections: any[];
}

const Breadcrumbs = ({ docSections }: BreadcrumbsProps) => {
    const location = useLocation()
    
    // Determine active section ID from URL path
    const activeSection = location.pathname === '/' 
        ? 'getting-started' 
        : location.pathname.replace('/', '');

    const section = docSections.find(s => s.id === activeSection);
    
    if (!section || activeSection === 'getting-started') {
        return null; // No breadcrumbs on home page
    }

    // Get category name
    const categoryNames: Record<string, string> = {
        'guide': 'Guides',
        'integration': 'Integration',
        'developer': 'Developer'
    };

    const categoryName = section.category ? categoryNames[section.category] : null;
    const categoryFirstPage = docSections.find(s => s.category === section.category)?.id;

    return (
        <div className="breadcrumbs">
            <Link to="/">Home</Link>
            {categoryName && categoryFirstPage && (
                <>
                    <span className="breadcrumb-separator">/</span>
                    <Link to={`/${categoryFirstPage}`}>{categoryName}</Link>
                </>
            )}
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{section.title}</span>
        </div>
    )
}

export default Breadcrumbs
