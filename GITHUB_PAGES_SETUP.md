# GitHub Pages Setup Guide for ShoreSquad

## Automatic Setup (Using GitHub Actions)

Your repository is now configured with GitHub Actions for automatic deployment. Here's how it works:

### ✅ What's Configured:
1. **.github/workflows/deploy.yml** - Automatically deploys on push to `main`
2. **.nojekyll** - Prevents Jekyll processing (ensures correct file serving)
3. **GitHub Actions** - Handles automatic deployment

### 🚀 Your Site is Live At:
```
https://jordanchoa123.github.io/ShoreSquad
```

### 📋 Verification Steps:

1. **Go to Repository Settings**:
   - Navigate to: https://github.com/jordanchoa123/ShoreSquad/settings/pages

2. **Check Pages Settings**:
   - Source should be "Deploy from a branch" or "GitHub Actions"
   - Branch should be `main` or `gh-pages`
   - Folder should be `/ (root)`

3. **Access Your Site**:
   - Visit: https://jordanchoa123.github.io/ShoreSquad
   - Your site should load within 1-2 minutes

### 🔄 Automatic Updates:
Every time you push to the `main` branch:
- GitHub Actions automatically builds and deploys
- Your changes go live automatically
- No manual intervention needed

### ⚠️ Troubleshooting:

**Site Not Loading?**
1. Wait 2-3 minutes after pushing
2. Check GitHub Actions tab for deployment status
3. Look for errors in the Actions log
4. Verify .nojekyll file exists in root
5. Clear browser cache (Ctrl+Shift+Del)

**Custom Domain?**
1. Add CNAME file with your domain
2. Update DNS settings
3. Enable "Enforce HTTPS"

**Need Manual Deployment?**
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose `main` branch
4. Save

### 📚 More Info:
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [About GitHub Actions](https://docs.github.com/actions)
- [Custom Domains](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
