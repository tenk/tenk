import React, { createContext, useContext, useState, useCallback, useEffect, isValidElement } from 'react';

interface Route {
  path: string;
  component: React.ComponentType;
}

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProps {
  children: React.ReactNode;
}

export function Router({ children }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [params, _setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
}

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export function Route({ element }: RouteProps) {
  return <>{element}</>;
}

interface RoutesProps {
  children: React.ReactNode;
}

export function Routes({ children }: RoutesProps) {
  const { currentPath } = useRouter();

  const matchRoute = (path: string): { match: boolean; params: Record<string, string> } => {
    const pathParts = path.split('/');
    const currentParts = currentPath.split('/');

    if (pathParts.length !== currentParts.length && !path.endsWith('*')) {
      return { match: false, params: {} };
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i] === '*') {
        return { match: true, params };
      }
      if (pathParts[i].startsWith(':')) {
        params[pathParts[i].slice(1)] = currentParts[i];
      } else if (pathParts[i] !== currentParts[i]) {
        return { match: false, params: {} };
      }
    }

    return { match: true, params };
  };

  let matchedElement: React.ReactNode = null;
  let matchedParams: Record<string, string> = {};

  const childArray = React.Children.toArray(children);
  for (const child of childArray) {
    if (isValidElement(child) && child.type === Route) {
      const { path, element } = child.props as RouteProps;
      const { match, params } = matchRoute(path);
      if (match && !matchedElement) {
        matchedElement = element;
        matchedParams = params;
      }
    }
  }

  const { navigate } = useRouter();
  
  return (
    <RouterContext.Provider value={{ currentPath, navigate, params: matchedParams }}>
      {matchedElement}
    </RouterContext.Provider>
  );
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const { params } = useRouter();
  return params as T;
}

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ to, children, className }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}
