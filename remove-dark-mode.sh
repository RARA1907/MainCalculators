#!/bin/bash

# Remove dark mode classes from all tsx files
find src -type f -name "*.tsx" -exec sed -i '' \
  -e 's/dark:bg-[^"]*//g' \
  -e 's/dark:text-[^"]*//g' \
  -e 's/dark:border-[^"]*//g' \
  -e 's/dark:prose-[^"]*//g' \
  -e 's/dark:hover-[^"]*//g' \
  -e 's/dark:[^"]*//g' \
  -e 's/\s\+"/"/g' \
  -e 's/"\s\+/"/g' \
  -e 's/\s\+class/class/g' {} +

# Remove empty className attributes
find src -type f -name "*.tsx" -exec sed -i '' \
  -e 's/className="[[:space:]]*"//g' \
  -e 's/className={\`[[:space:]]*\`}//g' {} +
