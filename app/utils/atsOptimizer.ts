export function optimizeForATS(text: string): string {
    // Remove special characters and emojis
    text = text.replace(/[^\w\s]/gi, '')
  
    // Convert to lowercase
    text = text.toLowerCase()
  
    // Replace common abbreviations
    const abbreviations: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'react': 'reactjs',
      'vue': 'vuejs',
      'aws': 'amazon web services',
      'ui': 'user interface',
      'ux': 'user experience',
      'api': 'application programming interface',
      'db': 'database',
      'oop': 'object oriented programming',
      'ci': 'continuous integration',
      'cd': 'continuous deployment',
      'ml': 'machine learning',
      'ai': 'artificial intelligence',
      'qa': 'quality assurance',
      'seo': 'search engine optimization',
    }
  
    for (const [abbr, full] of Object.entries(abbreviations)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi')
      text = text.replace(regex, full)
    }
  
    return text
  }
  