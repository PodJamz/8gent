#!/bin/bash

# Files to update
files=(
  "src/app/api/auth/ipod/route.ts"
  "src/app/api/cron/hourly-summary/route.ts"
  "src/app/api/cron/reminders/route.ts"
  "src/app/api/erv/import/route.ts"
  "src/app/api/jobs/process/route.ts"
  "src/app/api/memory/upload/route.ts"
  "src/app/api/music/generate/route.ts"
  "src/app/api/sandbox/route.ts"
  "src/app/api/voice/discovery/v1/chat/completions/route.ts"
  "src/app/api/webhooks/email/route.ts"
  "src/app/api/webhooks/imessage/route.ts"
  "src/app/api/whisper/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    # Replace ConvexHttpClient import
    sed -i '' "s|from 'convex/browser'|from '@/lib/convex-shim'|g" "$file"
    # Replace makeFunctionReference import with shim
    sed -i '' "s|import { makeFunctionReference } from 'convex/server';|// Shim for makeFunctionReference\nconst makeFunctionReference = <T1, T2, T3>(name: string): string => name;|g" "$file"
  fi
done

echo "Done!"
