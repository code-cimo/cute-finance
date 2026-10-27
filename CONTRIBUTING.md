# 🤝 Contributing to CuteFinance PWA

Terima kasih atas minat Anda untuk berkontribusi! 🐾

## 📋 Daftar Isi

1. [Code of Conduct](#code-of-conduct)
2. [Cara Berkontribusi](#cara-berkontribusi)
3. [Development Setup](#development-setup)
4. [Style Guide](#style-guide)
5. [Pull Request Process](#pull-request-process)
6. [Bug Reports](#bug-reports)
7. [Feature Requests](#feature-requests)

## Code of Conduct

Project ini mengikuti [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Dengan berpartisipasi, Anda diharapkan untuk menjaga standar komunitas.

## Cara Berkontribusi

### 🐛 Melaporkan Bug

1. Cek apakah bug sudah dilaporkan di [Issues](https://github.com/yourusername/cutefinance-pwa/issues)
2. Jika belum, buat issue baru dengan template bug report
3. Sertakan informasi:
   - Deskripsi jelas tentang bug
   - Langkah untuk reproduce
   - Expected vs actual behavior
   - Screenshots (jika ada)
   - Environment (OS, browser, versi)

### 💡 Mengusulkan Fitur

1. Cek apakah fitur sudah diusulkan di [Issues](https://github.com/yourusername/cutefinance-pwa/issues)
2. Buat issue baru dengan label "enhancement"
3. Jelaskan:
   - Use case untuk fitur
   - Expected behavior
   - Mockup/wireframe (jika ada)

### 🔧 Submitting Code

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- npm atau yarn
- Git
- Code editor (VS Code recommended)

### Setup

```bash
# 1. Fork repository di GitHub

# 2. Clone fork Anda
git clone https://github.com/YOUR_USERNAME/cutefinance-pwa.git
cd cutefinance-pwa

# 3. Add upstream remote
git remote add upstream https://github.com/yourusername/cutefinance-pwa.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Create feature branch
git checkout -b feature/your-feature-name
```

### Project Structure

```
cutefinance-pwa/
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Statistics.tsx
│   │   ├── Settings.tsx
│   │   ├── SetupWizard.tsx
│   │   ├── AddTransaction.tsx
│   │   ├── BottomNav.tsx
│   │   ├── FAB.tsx
│   │   ├── Mascot.tsx
│   │   ├── Notification.tsx
│   │   └── InstallPrompt.tsx
│   ├── types.ts         # TypeScript types
│   ├── store.ts         # Data management
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── sw.js            # Service worker
├── docs/                # Documentation
├── systemd/             # Systemd service files
├── docker/              # Docker configs
├── install.sh           # Installer script
├── quickstart.sh        # Quick start script
└── README.md            # Main documentation
```

### Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
```

## Style Guide

### TypeScript

- Gunakan TypeScript strict mode
- Define types di `src/types.ts`
- Hindari `any` type
- Use interfaces untuk objects

```typescript
// ✅ Good
interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
}

// ❌ Bad
const transaction: any = {...}
```

### React

- Functional components dengan hooks
- Component name dalam PascalCase
- Props interface untuk setiap component
- Destructure props

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Bad
const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### CSS/Tailwind

- Gunakan Tailwind utility classes
- Custom colors di `src/index.css`
- Responsive design mobile-first
- Consistent spacing (4px grid)

```tsx
// ✅ Good
<div className="bg-pastel-pink rounded-2xl p-4 shadow-sm">

// ❌ Bad
<div style={{ backgroundColor: '#F8BBD0', padding: '16px' }}>
```

### Naming Conventions

- **Components**: PascalCase (`Dashboard.tsx`)
- **Functions**: camelCase (`calculateBudget`)
- **Constants**: UPPER_SNAKE_CASE (`CATEGORY_COLORS`)
- **Types**: PascalCase (`Transaction`, `UserProfile`)
- **Files**: PascalCase for components, kebab-case for others

### Code Organization

- Satu component per file
- Max 300 lines per file
- Group related code together
- Comment complex logic

```typescript
// ✅ Good structure
// 1. Imports
import React from 'react';
import { Transaction } from '../types';

// 2. Types/Interfaces
interface Props {
  transactions: Transaction[];
}

// 3. Component
export const TransactionList: React.FC<Props> = ({ transactions }) => {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Helper functions
  const formatAmount = (amount: number) => {...};
  
  // 3.3 Render
  return <div>...</div>;
};
```

## Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run typecheck
   npm run build
   ```

2. **Update documentation**
   - Update README.md jika ada perubahan fitur
   - Add comments untuk complex code
   - Update CHANGELOG.md

3. **Check code quality**
   - No console.log statements
   - No unused imports
   - Consistent formatting
   - Meaningful commit messages

### Commit Messages

Format: `<type>(<scope>): <subject>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(dashboard): add savings goal tracker
fix(transactions): correct amount calculation
docs(readme): update installation guide
style(components): format code with prettier
refactor(store): simplify data management
```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested on desktop browser
- [ ] Tested on mobile browser
- [ ] Tested PWA installation
- [ ] No console errors

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass
```

### Review Process

1. PR akan di-review oleh maintainer
2. Feedback akan diberikan jika ada perubahan yang diperlukan
3. Setelah approved, PR akan di-merge
4. Contributor akan di-credit di CHANGELOG

## Bug Reports

### Template Bug Report

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Ubuntu 20.04]
 - Browser: [e.g. Chrome 120, Safari 17]
 - Version: [e.g. 1.0.0]
 - Device: [e.g. Odroid C2, iPhone 13]

**Additional context**
Add any other context about the problem here.
```

## Feature Requests

### Template Feature Request

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Use case**
Explain how this feature would be used and who would benefit from it.

**Mockups**
If applicable, add mockups or wireframes to help explain the feature.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Development Tips

### Adding a New Mascot

1. Edit `src/components/Mascot.tsx`
2. Tambah case baru di switch statement
3. Buat SVG untuk mascot
4. Update `src/types.ts` untuk type
5. Update `src/store.ts` untuk category

### Adding a New Category

1. Edit `src/types.ts` - tambah ke CategoryType
2. Edit `src/store.ts`:
   - Tambah ke CATEGORY_COLORS
   - Tambah ke CATEGORY_ICONS
   - Tambah ke CATEGORY_LABELS
3. Update `src/components/AddTransaction.tsx` jika perlu

### Adding a New Page

1. Create component di `src/components/`
2. Update `src/types.ts` - tambah ke PageType
3. Update `src/App.tsx` - import dan render
4. Update `src/components/BottomNav.tsx` - tambah nav item

## Testing

### Manual Testing Checklist

- [ ] Setup wizard works
- [ ] Can add transactions
- [ ] Dashboard displays correctly
- [ ] Statistics show accurate data
- [ ] Settings can be changed
- [ ] Export/Import works
- [ ] PWA installs correctly
- [ ] Offline mode works
- [ ] Mobile responsive
- [ ] No console errors

### Browser Testing

Test di:
- Chrome (Desktop & Mobile)
- Firefox
- Safari (iOS)
- Edge

### Device Testing

Test di:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- Mobile Large (414x896)

## Questions?

Jika ada pertanyaan, silakan:
- Buka [Discussion](https://github.com/yourusername/cutefinance-pwa/discussions)
- Email: support@cutefinance.app
- Join Discord: [Link](https://discord.gg/cutefinance)

---

Terima kasih sudah berkontribusi! 🐾✨
