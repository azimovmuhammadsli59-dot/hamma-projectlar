interface TechIconProps {
  id: string;
  className?: string;
}

export function TechIcon({ id, className = 'w-7 h-7' }: TechIconProps) {
  switch (id) {
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 3L5.6 19.2L12 21L18.4 19.2L20 3H4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 7.5H8L8.4 11.5H15.6L15 16L12 16.9L9 16L8.8 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'css3':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 3L5.6 19.2L12 21L18.4 19.2L20 3H4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 7.5H16.5L15.8 11.5H9.5M15.8 11.5L15.1 16L12 16.9L8.9 16L8.7 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'scss':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect
            x="3.5"
            y="4.5"
            width="17"
            height="15"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M9.8 9.2C8.6 8.5 7.2 9.1 7.2 10.2C7.2 11.7 10.3 11.7 10.3 13.5C10.3 14.7 8.8 15.3 7.3 14.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16.7 9.6C15.8 8.7 13.8 8.9 13.2 10.4C12.6 11.8 13.2 14.2 14.9 14.8C15.7 15.1 16.5 14.8 17 14.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10.5 10V15.5C10.5 16.6 9.8 17.3 8.8 17.3C8.1 17.3 7.6 17 7.2 16.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16.8 11.2C16.2 10.4 15.2 10.1 14.3 10.5C13.5 10.9 13.4 12.1 14.4 12.7L15.9 13.5C17 14.1 17 15.7 15.8 16.5C14.8 17.2 13.5 16.9 12.9 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'php':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse cx="12" cy="12" rx="9.5" ry="6" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6.8 14.2V9.8H8.6C9.5 9.8 10 10.3 10 11.1C10 11.9 9.5 12.4 8.6 12.4H6.8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.6 14.2V9.2M11.6 11.6H13.6V14.2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.4 14.2V9.8H17.2C18.1 9.8 18.6 10.3 18.6 11.1C18.6 11.9 18.1 12.4 17.2 12.4H15.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'reactjs':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(60 12 12)"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(120 12 12)"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
  }
}
