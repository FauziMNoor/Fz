---
inclusion: always
---

# 🔒 Security Guidelines

**Always follow these security practices when developing this application.**

---

## 1. Logging

### ✅ DO:

```javascript
import { logger } from 'src/utils/logger';

// Development-only logging
logger.log('Debug info:', data);
logger.info('Operation completed');

// Always logged (for monitoring)
logger.error('Error occurred:', error);
logger.warn('Warning:', message);
```

### ❌ DON'T:

```javascript
// Never use console.log directly
console.log('User data:', userData); // ❌ Exposed in production

// Never log sensitive data
logger.log('Password:', password); // ❌ Security risk
logger.log('API Key:', apiKey); // ❌ Security risk
```

---

## 2. Credentials

### ✅ DO:

```javascript
// Use environment variables
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### ❌ DON'T:

```javascript
// Never hardcode credentials
const apiKey = 'sk_live_123456789'; // ❌ Security risk
const password = 'mypassword123'; // ❌ Security risk
```

---

## 3. Error Handling

### ✅ DO:

```javascript
try {
  await someOperation();
} catch (error) {
  // Log error for monitoring
  logger.error('Operation failed:', error);

  // Show user-friendly message
  toast.error('Something went wrong. Please try again.');
}
```

### ❌ DON'T:

```javascript
try {
  await someOperation();
} catch (error) {
  // Never expose full error to user
  toast.error(error.message); // ❌ May contain sensitive info

  // Never ignore errors silently
  // ❌ No error handling
}
```

---

## 4. Data Validation

### ✅ DO:

```javascript
// Validate user input
const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

// Sanitize data before saving
const sanitizedData = {
  name: data.name.trim(),
  email: data.email.toLowerCase(),
};
```

### ❌ DON'T:

```javascript
// Never trust user input
await saveToDatabase(userInput); // ❌ No validation

// Never expose internal IDs
const url = `/user/${internalId}`; // ❌ Use slugs instead
```

---

## 5. File Uploads

### ✅ DO:

```javascript
// Validate file type and size
const allowedTypes = ['image/jpeg', 'image/png'];
const maxSize = 5 * 1024 * 1024; // 5MB

if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

if (file.size > maxSize) {
  throw new Error('File too large');
}
```

### ❌ DON'T:

```javascript
// Never accept any file type
await uploadFile(file); // ❌ No validation

// Never trust file extensions
if (file.name.endsWith('.jpg')) {
  // ❌ Can be spoofed
  await uploadFile(file);
}
```

---

## 6. Authentication

### ✅ DO:

```javascript
// Check authentication
if (!user?.id) {
  toast.error('Please login first');
  router.push('/auth/sign-in');
  return;
}

// Use RLS policies in Supabase
// Policies defined in database
```

### ❌ DON'T:

```javascript
// Never rely on client-side auth only
if (localStorage.getItem('isAdmin')) {
  // ❌ Can be manipulated
  showAdminPanel();
}
```

---

## 7. API Calls

### ✅ DO:

```javascript
// Use try-catch for all API calls
try {
  const data = await fetchData();
  return data;
} catch (error) {
  logger.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}
```

### ❌ DON'T:

```javascript
// Never expose API errors to users
const data = await fetchData(); // ❌ No error handling

// Never log full API responses
logger.log('API response:', response); // ❌ May contain sensitive data
```

---

## 🔍 Security Checklist

Before committing code, verify:

- [ ] No `console.log` (use `logger.log` instead)
- [ ] No hardcoded credentials
- [ ] No sensitive data in logs
- [ ] Input validation implemented
- [ ] Error handling in place
- [ ] Authentication checks present
- [ ] File upload validation
- [ ] `.env` not committed

---

## 📚 Resources

- Logger utility: `src/utils/logger.js`
- Security audit: `SECURITY_AUDIT_REPORT.md`
- Supabase RLS: `supabase_migrations/*.sql`

---

**Last Updated:** December 7, 2025
