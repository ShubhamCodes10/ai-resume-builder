\documentclass[a4paper,10pt]{article}
\usepackage{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{xcolor}
\geometry{top=1in, bottom=1in, left=1in, right=1in}

% Set font for the document
\renewcommand{\rmdefault}{ptm}  % Times New Roman

\begin{document}

\begin{center}
    \textbf{\Huge \textsc{Resume}} \\[1em]
    {\LARGE \textbf{Full Name:} \texttt{fullName}} \\[0.5em]
    {\large \textbf{Email:} \texttt{email}} \\
    {\large \textbf{Phone:} \texttt{phone}} \\
    \href{linkedin_link}{\texttt{LinkedIn: linkedin}} \\
    \href{github_link}{\texttt{GitHub: github}} \\
\end{center}

\section*{Education}
\begin{itemize}[left=0pt]
    \item \textbf{Institution:} institution \\
    \textbf{Degree:} degree \\
    \textbf{Location:} location \\
    \textbf{Duration:} startDate - endDate \\
    \textbf{GPA:} GPA
    % Loop over the education array and display each entry
\end{itemize}

\section*{Skills Summary}
\begin{itemize}[left=0pt]
    \item \textbf{Category1:} skill1, skill2, skill3
    \item \textbf{Category2:} skill4, skill5, skill6
    % Loop over the skills object and display each category and skills
\end{itemize}

\section*{Work Experience}
\begin{itemize}[left=0pt]
    \item \textbf{Title:} jobTitle \\
    \textbf{Company:} companyName \\
    \textbf{Duration:} startDate - endDate \\
    \textbf{Link:} \href{link}{jobLink} \\
    \textbf{Achievements:} \\
    \begin{itemize}
        \item Achievement1
        \item Achievement2
    \end{itemize}
    % Loop through the experience array and display each job
\end{itemize}

\section*{Projects}
\begin{itemize}[left=0pt]
    \item \textbf{Project Title:} projectTitle \\
    \textbf{Link:} \href{projectLink}{Project Link} \\
    \textbf{Duration:} duration \\
    \textbf{Description:}
    \begin{itemize}
        \item ProjectDescription1
        \item ProjectDescription2
    \end{itemize}
    % Loop through the projects array and display each project
\end{itemize}

\section*{Certificates}
\begin{itemize}[left=0pt]
    \item \textbf{Certificate Name:} certificateName \\
    \textbf{Organization:} organization \\
    \textbf{Date:} date \\
    \href{certificateLink}{\texttt{View Certificate}}
    % Loop through the certificates array and display each certificate
\end{itemize}

\end{document}
