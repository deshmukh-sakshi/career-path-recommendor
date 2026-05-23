# Gemini 2.0 Model Update

## Updated to Gemini 2.0!

Changed all API routes to use **`gemini-2.0-flash-exp`** (Gemini 2.0 experimental model)

## Files Updated

1. ✅ `app/api/ai/extract-skills/route.ts` → `gemini-2.0-flash-exp`
2. ✅ `app/api/ai/analyze-career/route.ts` → `gemini-2.0-flash-exp`
3. ✅ `lib/gemini.ts` → `gemini-2.0-flash-exp`
4. ✅ `app/api/test-gemini/route.ts` → `gemini-2.0-flash-exp`

## Model: gemini-2.0-flash-exp

**Features:**
- ⚡ Latest Gemini 2.0 model
- 🚀 Faster than previous versions
- 🎯 Better accuracy
- 💡 Improved reasoning
- 🆓 Available in free tier

## Next Steps

**1. Restart your dev server:**
```bash
# Stop current server (Ctrl+C)
npm run dev
```

**2. Upload your resume again**

**3. Should work now!** ✅

## If Still Not Working

Your API key might not have access to experimental models. Try these alternatives:

### Option 1: Use stable model
Change to `gemini-1.5-pro` (stable, widely available)

### Option 2: Get new API key
1. Go to: https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update `.env` file
4. Restart server

## Available Models (as of now)

| Model | Status | Speed | Quality |
|-------|--------|-------|---------|
| gemini-2.0-flash-exp | ✅ Experimental | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| gemini-1.5-pro | ✅ Stable | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| gemini-1.5-flash | ✅ Stable | ⚡⚡⚡ | ⭐⭐⭐ |
| gemini-pro | ❌ Deprecated | - | - |

**We're using: `gemini-2.0-flash-exp`** 🚀
