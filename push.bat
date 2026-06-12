git add -A
git commit -m "debug: expose real errors in response + public test-ai endpoint + fix cloudbuild"
git push origin main
git push fp_repo main
git push fp_repo main:backend --force
