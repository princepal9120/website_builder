import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types
export type ElementType = 'text' | 'image' | 'button' | 'container' | 'form';

export interface ElementStyles {
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  [key: string]: string | undefined;
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  content: string;
  styles: ElementStyles;
  parentId: string | null;
  children: string[];
  order: number;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  elements: Record<string, BuilderElement>;
}

// State interface
interface BuilderState {
  elements: Record<string, BuilderElement>;
  selectedElementId: string | null;
  history: Array<Record<string, BuilderElement>>;
  historyIndex: number;
  templates: Template[];
  activeTemplateId: string | null;
}

// Action types
type BuilderAction =
  | { type: 'ADD_ELEMENT'; element: BuilderElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<BuilderElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'REORDER_ELEMENT'; id: string; newIndex: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_TEMPLATE'; templateId: string }
  | { type: 'UPDATE_HISTORY' };

// Initial state
const initialElements: Record<string, BuilderElement> = {};

// Define initial templates
const initialTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    thumbnail: 'blank-template.png',
    elements: {
      root: {
        id: 'root',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          minHeight: '100vh',
        },
        parentId: null,
        children: [],
        order: 0,
      },
    },
  },
  // Landing page template
  {
    id: 'landing-page',
    name: 'Landing Page',
    thumbnail: 'landing-template.png',
    elements: {
      root: {
        id: 'root',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          minHeight: '100vh',
        },
        parentId: null,
        children: ['header', 'hero', 'features'],
        order: 0,
      },
      header: {
        id: 'header',
        type: 'container',
        content: '',
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          backgroundColor: 'white',
          marginBottom: '20px',
        },
        parentId: 'root',
        children: ['logo', 'nav'],
        order: 0,
      },
      logo: {
        id: 'logo',
        type: 'text',
        content: 'LOGO',
        styles: {
          fontWeight: 'bold',
          fontSize: '24px',
          color: '#3B82F6',
        },
        parentId: 'header',
        children: [],
        order: 0,
      },
      nav: {
        id: 'nav',
        type: 'container',
        content: '',
        styles: {
          display: 'flex',
          gap: '20px',
        },
        parentId: 'header',
        children: ['nav-item-1', 'nav-item-2', 'nav-item-3'],
        order: 1,
      },
      'nav-item-1': {
        id: 'nav-item-1',
        type: 'text',
        content: 'Home',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'nav',
        children: [],
        order: 0,
      },
      'nav-item-2': {
        id: 'nav-item-2',
        type: 'text',
        content: 'Features',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'nav',
        children: [],
        order: 1,
      },
      'nav-item-3': {
        id: 'nav-item-3',
        type: 'text',
        content: 'Contact',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'nav',
        children: [],
        order: 2,
      },
      hero: {
        id: 'hero',
        type: 'container',
        content: '',
        styles: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
          marginBottom: '40px',
        },
        parentId: 'root',
        children: ['hero-title', 'hero-desc', 'hero-button'],
        order: 1,
      },
      'hero-title': {
        id: 'hero-title',
        type: 'text',
        content: 'Build Your Website with Drag and Drop',
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '20px',
        },
        parentId: 'hero',
        children: [],
        order: 0,
      },
      'hero-desc': {
        id: 'hero-desc',
        type: 'text',
        content: 'Create beautiful responsive websites without writing code.',
        styles: {
          fontSize: '18px',
          color: '#6B7280',
          marginBottom: '30px',
          maxWidth: '600px',
        },
        parentId: 'hero',
        children: [],
        order: 1,
      },
      'hero-button': {
        id: 'hero-button',
        type: 'button',
        content: 'Get Started',
        styles: {
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
        },
        parentId: 'hero',
        children: [],
        order: 2,
      },
      features: {
        id: 'features',
        type: 'container',
        content: '',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '20px 0',
        },
        parentId: 'root',
        children: ['feature-1', 'feature-2', 'feature-3'],
        order: 2,
      },
      'feature-1': {
        id: 'feature-1',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        parentId: 'features',
        children: ['feature-1-title', 'feature-1-desc'],
        order: 0,
      },
      'feature-1-title': {
        id: 'feature-1-title',
        type: 'text',
        content: 'Drag & Drop',
        styles: {
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'feature-1',
        children: [],
        order: 0,
      },
      'feature-1-desc': {
        id: 'feature-1-desc',
        type: 'text',
        content: 'Build layouts intuitively with our easy drag and drop interface.',
        styles: {
          color: '#6B7280',
        },
        parentId: 'feature-1',
        children: [],
        order: 1,
      },
      'feature-2': {
        id: 'feature-2',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        parentId: 'features',
        children: ['feature-2-title', 'feature-2-desc'],
        order: 1,
      },
      'feature-2-title': {
        id: 'feature-2-title',
        type: 'text',
        content: 'Responsive Design',
        styles: {
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'feature-2',
        children: [],
        order: 0,
      },
      'feature-2-desc': {
        id: 'feature-2-desc',
        type: 'text',
        content: 'All elements adapt perfectly to any screen size.',
        styles: {
          color: '#6B7280',
        },
        parentId: 'feature-2',
        children: [],
        order: 1,
      },
      'feature-3': {
        id: 'feature-3',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        parentId: 'features',
        children: ['feature-3-title', 'feature-3-desc'],
        order: 2,
      },
      'feature-3-title': {
        id: 'feature-3-title',
        type: 'text',
        content: 'Custom Styling',
        styles: {
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'feature-3',
        children: [],
        order: 0,
      },
      'feature-3-desc': {
        id: 'feature-3-desc',
        type: 'text',
        content: 'Customize colors, fonts, sizes and more with our visual editor.',
        styles: {
          color: '#6B7280',
        },
        parentId: 'feature-3',
        children: [],
        order: 1,
      },
    },
  },
  // Blog template
  {
    id: 'blog',
    name: 'Blog',
    thumbnail: 'blog-template.png',
    elements: {
      root: {
        id: 'root',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          minHeight: '100vh',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        parentId: null,
        children: ['header', 'content'],
        order: 0,
      },
      header: {
        id: 'header',
        type: 'container',
        content: '',
        styles: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '40px',
        },
        parentId: 'root',
        children: ['blog-title', 'blog-nav'],
        order: 0,
      },
      'blog-title': {
        id: 'blog-title',
        type: 'text',
        content: 'My Blog',
        styles: {
          fontSize: '24px',
          fontWeight: 'bold',
        },
        parentId: 'header',
        children: [],
        order: 0,
      },
      'blog-nav': {
        id: 'blog-nav',
        type: 'container',
        content: '',
        styles: {
          display: 'flex',
          gap: '20px',
        },
        parentId: 'header',
        children: ['blog-nav-1', 'blog-nav-2', 'blog-nav-3'],
        order: 1,
      },
      'blog-nav-1': {
        id: 'blog-nav-1',
        type: 'text',
        content: 'Home',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'blog-nav',
        children: [],
        order: 0,
      },
      'blog-nav-2': {
        id: 'blog-nav-2',
        type: 'text',
        content: 'Articles',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'blog-nav',
        children: [],
        order: 1,
      },
      'blog-nav-3': {
        id: 'blog-nav-3',
        type: 'text',
        content: 'About',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'blog-nav',
        children: [],
        order: 2,
      },
      content: {
        id: 'content',
        type: 'container',
        content: '',
        styles: {
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
        },
        parentId: 'root',
        children: ['posts', 'sidebar'],
        order: 1,
      },
      posts: {
        id: 'posts',
        type: 'container',
        content: '',
        styles: {},
        parentId: 'content',
        children: ['post-1', 'post-2'],
        order: 0,
      },
      'post-1': {
        id: 'post-1',
        type: 'container',
        content: '',
        styles: {
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        parentId: 'posts',
        children: ['post-1-title', 'post-1-meta', 'post-1-content'],
        order: 0,
      },
      'post-1-title': {
        id: 'post-1-title',
        type: 'text',
        content: 'Getting Started with Website Building',
        styles: {
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'post-1',
        children: [],
        order: 0,
      },
      'post-1-meta': {
        id: 'post-1-meta',
        type: 'text',
        content: 'June 15, 2023 • 5 min read',
        styles: {
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '20px',
        },
        parentId: 'post-1',
        children: [],
        order: 1,
      },
      'post-1-content': {
        id: 'post-1-content',
        type: 'text',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...',
        styles: {},
        parentId: 'post-1',
        children: [],
        order: 2,
      },
      'post-2': {
        id: 'post-2',
        type: 'container',
        content: '',
        styles: {
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        parentId: 'posts',
        children: ['post-2-title', 'post-2-meta', 'post-2-content'],
        order: 1,
      },
      'post-2-title': {
        id: 'post-2-title',
        type: 'text',
        content: 'Design Tips for Better Websites',
        styles: {
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'post-2',
        children: [],
        order: 0,
      },
      'post-2-meta': {
        id: 'post-2-meta',
        type: 'text',
        content: 'June 10, 2023 • 4 min read',
        styles: {
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '20px',
        },
        parentId: 'post-2',
        children: [],
        order: 1,
      },
      'post-2-content': {
        id: 'post-2-content',
        type: 'text',
        content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia...',
        styles: {},
        parentId: 'post-2',
        children: [],
        order: 2,
      },
      sidebar: {
        id: 'sidebar',
        type: 'container',
        content: '',
        styles: {},
        parentId: 'content',
        children: ['about-widget', 'categories-widget'],
        order: 1,
      },
      'about-widget': {
        id: 'about-widget',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        parentId: 'sidebar',
        children: ['about-title', 'about-content'],
        order: 0,
      },
      'about-title': {
        id: 'about-title',
        type: 'text',
        content: 'About Me',
        styles: {
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'about-widget',
        children: [],
        order: 0,
      },
      'about-content': {
        id: 'about-content',
        type: 'text',
        content: 'Hello! I\'m a web designer sharing tips and tricks about website building and design.',
        styles: {},
        parentId: 'about-widget',
        children: [],
        order: 1,
      },
      'categories-widget': {
        id: 'categories-widget',
        type: 'container',
        content: '',
        styles: {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        parentId: 'sidebar',
        children: ['categories-title', 'categories-list'],
        order: 1,
      },
      'categories-title': {
        id: 'categories-title',
        type: 'text',
        content: 'Categories',
        styles: {
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '10px',
        },
        parentId: 'categories-widget',
        children: [],
        order: 0,
      },
      'categories-list': {
        id: 'categories-list',
        type: 'container',
        content: '',
        styles: {},
        parentId: 'categories-widget',
        children: ['category-1', 'category-2', 'category-3'],
        order: 1,
      },
      'category-1': {
        id: 'category-1',
        type: 'text',
        content: 'Web Design (5)',
        styles: {
          marginBottom: '5px',
          cursor: 'pointer',
        },
        parentId: 'categories-list',
        children: [],
        order: 0,
      },
      'category-2': {
        id: 'category-2',
        type: 'text',
        content: 'Development (3)',
        styles: {
          marginBottom: '5px',
          cursor: 'pointer',
        },
        parentId: 'categories-list',
        children: [],
        order: 1,
      },
      'category-3': {
        id: 'category-3',
        type: 'text',
        content: 'UI/UX (2)',
        styles: {
          cursor: 'pointer',
        },
        parentId: 'categories-list',
        children: [],
        order: 2,
      },
    },
  },
];

const initialState: BuilderState = {
  elements: initialElements,
  selectedElementId: null,
  history: [initialElements],
  historyIndex: 0,
  templates: initialTemplates,
  activeTemplateId: null,
};

// Reducer function
const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newElements = {
        ...state.elements,
        [action.element.id]: action.element,
      };
      
      // If the element has a parent, update the parent's children
      if (action.element.parentId) {
        const parent = state.elements[action.element.parentId];
        if (parent) {
          newElements[action.element.parentId] = {
            ...parent,
            children: [...parent.children, action.element.id],
          };
        }
      }
      
      return {
        ...state,
        elements: newElements,
        selectedElementId: action.element.id,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_ELEMENT': {
      const element = state.elements[action.id];
      if (!element) return state;

      const updatedElement = {
        ...element,
        ...action.updates,
      };

      const newElements = {
        ...state.elements,
        [action.id]: updatedElement,
      };

      return {
        ...state,
        elements: newElements,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'DELETE_ELEMENT': {
      const elementToDelete = state.elements[action.id];
      if (!elementToDelete) return state;

      const newElements = { ...state.elements };
      
      // Remove reference from parent
      if (elementToDelete.parentId) {
        const parent = newElements[elementToDelete.parentId];
        if (parent) {
          newElements[elementToDelete.parentId] = {
            ...parent,
            children: parent.children.filter(childId => childId !== action.id),
          };
        }
      }

      // Delete this element and all its children recursively
      const deleteRecursively = (id: string) => {
        const element = newElements[id];
        if (!element) return;
        
        // First delete all children
        element.children.forEach(childId => {
          deleteRecursively(childId);
        });
        
        // Then delete this element
        delete newElements[id];
      };

      deleteRecursively(action.id);

      return {
        ...state,
        elements: newElements,
        selectedElementId: elementToDelete.parentId,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.id,
      };
    }

    case 'REORDER_ELEMENT': {
      const element = state.elements[action.id];
      if (!element || element.parentId === null) return state;

      const parent = state.elements[element.parentId];
      if (!parent) return state;

      // Create a new array of children with updated orders
      const reorderedChildren = [...parent.children];
      const currentIndex = reorderedChildren.indexOf(action.id);
      
      if (currentIndex < 0) return state;
      
      reorderedChildren.splice(currentIndex, 1);
      reorderedChildren.splice(action.newIndex, 0, action.id);
      
      // Update orders for all children
      const newElements = { ...state.elements };
      reorderedChildren.forEach((childId, index) => {
        newElements[childId] = {
          ...newElements[childId],
          order: index,
        };
      });
      
      // Update the parent's children array
      newElements[element.parentId] = {
        ...parent,
        children: reorderedChildren,
      };

      return {
        ...state,
        elements: newElements,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      
      return {
        ...state,
        elements: state.history[newIndex],
        historyIndex: newIndex,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      
      return {
        ...state,
        elements: state.history[newIndex],
        historyIndex: newIndex,
      };
    }

    case 'SET_TEMPLATE': {
      const template = state.templates.find(t => t.id === action.templateId);
      if (!template) return state;

      return {
        ...state,
        elements: template.elements,
        activeTemplateId: action.templateId,
        selectedElementId: null,
        history: [template.elements],
        historyIndex: 0,
      };
    }

    case 'UPDATE_HISTORY': {
      return {
        ...state,
        history: [...state.history.slice(0, state.historyIndex + 1), state.elements],
        historyIndex: state.historyIndex + 1,
      };
    }

    default:
      return state;
  }
};

// Create the context
interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  addElement: (type: ElementType, parentId: string | null) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  setTemplate: (templateId: string) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

// Provider component
export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  // Helper functions
  const addElement = (type: ElementType, parentId: string | null) => {
    const id = uuidv4();
    let content = '';
    let styles: ElementStyles = {};

    // Default content and styles based on element type
    switch (type) {
      case 'text':
        content = 'Edit this text';
        styles = {
          fontSize: '16px',
          color: '#333',
          padding: '10px',
        };
        break;
      case 'button':
        content = 'Button';
        styles = {
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'inline-block',
        };
        break;
      case 'image':
        content = 'https://via.placeholder.com/300x200';
        styles = {
          width: '100%',
          height: 'auto',
        };
        break;
      case 'container':
        styles = {
          padding: '20px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          minHeight: '100px',
        };
        break;
      case 'form':
        styles = {
          padding: '20px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        };
        break;
    }

    const newElement: BuilderElement = {
      id,
      type,
      content,
      styles,
      parentId,
      children: [],
      order: 0, // Will be updated by parent if needed
    };

    dispatch({ type: 'ADD_ELEMENT', element: newElement });
  };

  const updateElement = (id: string, updates: Partial<BuilderElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', id, updates });
  };

  const deleteElement = (id: string) => {
    dispatch({ type: 'DELETE_ELEMENT', id });
  };

  const selectElement = (id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', id });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const setTemplate = (templateId: string) => {
    dispatch({ type: 'SET_TEMPLATE', templateId });
  };

  return (
    <BuilderContext.Provider value={{ 
      state, 
      dispatch,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      undo,
      redo,
      setTemplate
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

// Custom hook to use the builder context
export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
