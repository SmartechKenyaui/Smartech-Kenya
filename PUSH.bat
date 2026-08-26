@echo off
REM ==========================================================
REM  Smartech Kenya - apply restructured tree and push
REM  Run from inside your repo folder after extracting the zip.
REM ==========================================================

if not exist ".git" (
  echo ERROR: no .git folder here. Run this from your repo root.
  pause
  exit /b 1
)

echo.
echo ^>^>^> Removing files that moved or were deleted
echo.

REM stale favicon: a DIFFERENT image from the logo; Next gives it top precedence
call :drop "app\favicon.ico"

REM components\features\* flattened into components\product and components\search
call :drop "components\features\products\AddToCartButton.tsx"
call :drop "components\features\products\FeaturedProducts.tsx"
call :drop "components\features\products\ProductCard.tsx"
call :drop "components\features\products\ProductDetail.tsx"
call :drop "components\features\products\ProductFilters.tsx"
call :drop "components\features\products\ProductList.tsx"
call :drop "components\features\search\SearchBar.tsx"

REM legal pages moved under app\(legal)
call :drop "app\privacy\page.tsx"
call :drop "app\terms\page.tsx"

REM dead database / auth layer - nothing imported it, auth routes are 501 stubs
call :drop "lib\prisma.ts"
call :drop "lib\db\prisma.ts"
call :drop "lib\auth\config.ts"
call :drop "lib\auth\password.ts"
call :drop "lib\validation\schemas.ts"
call :drop "lib\utils\errors.ts"
call :drop "lib\utils\format.ts"
call :drop "prisma\schema.prisma"
call :drop "prisma\seed.ts"
call :drop "prisma\seed-runner.ts"

REM orphaned constants
call :drop "constants\index.ts"
call :drop "constants\images.ts"
call :drop "constants\heroImages.ts"

REM old scaffolding and one-off scripts
call :dropdir "allfix"
call :dropdir "smartech-fixes"
call :drop "deploy.py"
call :drop "deploy_favicon_brands.py"
call :drop "deploy_ui_fixes.py"
call :drop "deploy_ui_fixes.ps1"
call :drop "fix_all.py"
call :drop "fix_card.py"
call :drop "push_fixes.py"
call :drop "push-smartech.ps1"
call :drop "fix_and_push.py"
call :drop "staticProducts.ts"
call :drop "smartech-kenya-main.zip"
call :drop ".npmrc"

REM prune folders left empty
for %%D in ("components\features\products" "components\features\search" "components\features" "app\privacy" "app\terms" "lib\db" "lib\auth" "lib\validation" "lib\utils" "prisma") do (
  if exist %%D rmdir %%D 2>nul
)

echo.
echo ^>^>^> Committing and pushing
echo.
git add -A
git commit -m "refactor: restructure tree, drop dead DB layer, exact search, white theme, blue prices, square favicon"
git push

echo.
echo [DONE] Pushed. Vercel will redeploy automatically.
echo.
echo NOTE: dependencies changed - Vercel reinstalls automatically.
echo       Locally, run:  npm install
echo.
pause
exit /b 0

:drop
if exist %~1 (
  git rm -f --cached %~1 >nul 2>&1
  del /f /q %~1 >nul 2>&1
  echo   [removed] %~1
)
exit /b 0

:dropdir
if exist %~1 (
  git rm -r -f --cached %~1 >nul 2>&1
  rmdir /s /q %~1 >nul 2>&1
  echo   [removed] %~1\
)
exit /b 0
