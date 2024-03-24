#!/bin/bash

lint="eslint_report.txt"
build="build_report.txt"
cypress="cypress_report.txt"
covarage="coverage_report.txt"

lint_image="lint.svg"
cypress_image="cypress.svg"
build_image="build.svg"
covarage_image="covarage.svg"

# Bash file that read cypress_report.txt
# and generate badges

number_to_color() {
  local number=$1
  if [[ $number -lt 50 ]]
  then
    echo "red";
    return;
  fi
  if [[ $number -lt 75 ]]
  then
    echo "orange";
    return;
  fi
  if [[ $number -lt 85 ]]
  then
    echo "lightgreen"
    return;
  fi
  echo "green";
}

extract() {
  if grep -q "All specs passed!" "$cypress"
  then
    passed="100"
  else
    failure=$(grep -Eo "[[:digit:]]+%" "$cypress"| tr -d '%')
    failure="75"
    passed=$((100 - failure))
    echo "$passed"
  fi
  color=$(number_to_color "$passed")
  echo "cypress : $passed $color"
  anybadge -o -l "TESTS" -v "$passed%" -c "$color" -f "$cypress_image"
}

badge_lint() {
  count=$(grep "Line" "$lint" | wc -l)
  color="green"
  text="passed"
  if [ $count -gt 0 ]
  then
    color="red"
    text="$count errors"
  fi
  echo "lint : $text $color"
  anybadge -o -l "LINT" -v "$text" -c "$color" -f "$lint_image"
}

badge_coverage() {
  coverage=$(grep "All files" "$covarage" | awk '{print $4}')
  coverage=$(printf '%.*f\n' 0 $coverage)
  color=$(number_to_color "$coverage")
  echo "coverage : $coverage $color"
  anybadge -o -l "COVERAGE" -v "$coverage%" -c "$color" -f "$covarage_image"
}

# badge_build() {
#   text="ok"
#   color="green"
#   if grep -q "Failed to compile" $build
#   then
#     color="red"
#     text="failed"
#   fi
#   anybadge -o -l "BUILD" -v "$text" -c "$color" -f "$build"  
# }


if [ -f $cypress ]
then
  extract
else
  anybadge -o -l "TESTS" -v "Failed to start" -c "red" -f "$cypress_image"
fi

if [ -f $covarage ]
then
  badge_coverage
else
  anybadge -o -l "COVERAGE" -v "Failed to start" -c "red" -f "$covarage_image"
fi

if [ -f $lint ]
then
  badge_lint
else
  anybadge -o -l "LINT" -v "Failed to start" -c "red" -f "$lint_image"
fi

# if [ -f $build ]
# then
#   badge_build
# else
#   anybadge -o -l "BUILD" -v "Failed to start" -c "red" -f "$build_image"
# fi

exit 0
