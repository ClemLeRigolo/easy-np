#!/bin/bash

lint="eslint_report.txt"
build="build_report.txt"
cypress="cypress_report.txt"
coverage="coverage_report.txt"

lint_image="lint.svg"
cypress_image="cypress.svg"
build_image="build.svg"
coverage_image="coverage.svg"

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
    text="100%"
    color="green"
  else
    result=$(grep -E "[[:digit:]]+%" "$cypress" | sed 's/[ ][ ]*/ /g')
    echo "$result"
    tests_number=$(echo "$result" | cut -d ' ' -f 9)
    passed_number=$(echo "$result" | cut -d ' ' -f 10)
    failure_number=$(echo "$result" | cut -d ' ' -f 11)
    passed=$(($passed_number * 100 / $tests_number))
    text="$passed% (tests: $tests_number, passed: $passed_number, failed: $failure_number)"
    color=$(number_to_color "$passed")
  fi
  echo $text $color
  echo "cypress : $text $color"
  anybadge -o -l "TESTS" -v "$text" -c "$color" -f "$cypress_image"
}

badge_lint() {
  count=$(grep "problems" "$lint" | sed 's/.*(\(.*\))/\1/')
  color="green"
  text="passed"
  echo $count
  if [ -n "$count" ]
  then
    color="red"
    text="$count"
  fi
  echo "lint : $text $color"
  anybadge -o -l "LINT" -v "$text" -c "$color" -f "$lint_image"
}

badge_coverage() {
  coverage=$(grep "All files" "$coverage" | awk '{print $4}')
  coverage=$(printf '%.*f\n' 0 $coverage)
  color=$(number_to_color "$coverage")
  echo "coverage : $coverage $color"
  anybadge -o -l "COVERAGE" -v "$coverage%" -c "$color" -f "$coverage_image"
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

echo "cypress badge"
if [ -f $cypress ]
then
  extract
else
  echo "no cypress_report file"
  anybadge -o -l "TESTS" -v "Failed to start" -c "red" -f "$cypress_image"
fi

echo "coverage badge"
if [ -f $coverage ]
then
  badge_coverage
else
  echo "no coverage file"
  anybadge -o -l "COVERAGE" -v "Failed to start" -c "red" -f "$coverage_image"
fi
echo "lint badge"
if [ -f $lint ]
then
  badge_lint
else
  echo "no lint file"
  anybadge -o -l "LINT" -v "Failed to start" -c "red" -f "$lint_image"
fi

# if [ -f $build ]
# then
#   badge_build
# else
#   anybadge -o -l "BUILD" -v "Failed to start" -c "red" -f "$build_image"
# fi

exit 0
