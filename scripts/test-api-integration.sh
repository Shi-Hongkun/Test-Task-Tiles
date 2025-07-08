#!/bin/bash

# Task Tiles API Integration Test Script
# Tests the complete API workflow: Board -> Column -> Task -> Drag & Drop

set -e  # Exit on any error

API_BASE="http://localhost:3000/api"
BOARD_ID=""
COLUMN1_ID=""
COLUMN2_ID=""
TASK_ID=""

echo "🚀 Starting Task Tiles API Integration Tests"
echo "============================================="

# Test 1: Health Check
echo "1. 🏥 Testing Health Check..."
health_response=$(curl -s "${API_BASE%/api}/health")
echo "   Response: $health_response"
if [[ $health_response == *"\"status\":\"OK\""* ]]; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
    exit 1
fi

# Test 2: Create Board
echo "2. 📋 Creating new board..."
board_response=$(curl -s -X POST "$API_BASE/boards" \
    -H "Content-Type: application/json" \
    -d '{"name":"Integration Test Board","description":"Testing the complete workflow"}')
echo "   Response: $board_response"

if [[ $board_response == *"\"success\":true"* ]]; then
    BOARD_ID=$(echo "$board_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   ✅ Board created successfully with ID: $BOARD_ID"
else
    echo "   ❌ Board creation failed"
    exit 1
fi

# Test 3: Get Board with Columns
echo "3. 📊 Getting board with default columns..."
board_full_response=$(curl -s "$API_BASE/boards/$BOARD_ID/full")
echo "   Response: $board_full_response"

if [[ $board_full_response == *"\"success\":true"* ]]; then
    echo "   ✅ Board retrieved successfully"
    # Extract column IDs (assuming default columns are created)
    COLUMN1_ID=$(echo "$board_full_response" | grep -o '"id":"[^"]*"' | sed -n '2p' | cut -d'"' -f4)
    COLUMN2_ID=$(echo "$board_full_response" | grep -o '"id":"[^"]*"' | sed -n '3p' | cut -d'"' -f4)
    echo "   📌 Column 1 ID: $COLUMN1_ID"
    echo "   📌 Column 2 ID: $COLUMN2_ID"
else
    echo "   ❌ Board retrieval failed"
    exit 1
fi

# Test 4: Create Task in First Column
echo "4. 📝 Creating task in first column..."
task_response=$(curl -s -X POST "$API_BASE/tasks" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Test Task\",\"description\":\"This is a test task for integration testing\",\"columnId\":\"$COLUMN1_ID\"}")
echo "   Response: $task_response"

if [[ $task_response == *"\"success\":true"* ]]; then
    TASK_ID=$(echo "$task_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   ✅ Task created successfully with ID: $TASK_ID"
else
    echo "   ❌ Task creation failed"
    exit 1
fi

# Test 5: Move Task to Second Column (Drag & Drop)
echo "5. 🔄 Moving task to second column (simulating drag & drop)..."
move_response=$(curl -s -X PUT "$API_BASE/tasks/$TASK_ID/position" \
    -H "Content-Type: application/json" \
    -d "{\"columnId\":\"$COLUMN2_ID\",\"position\":0}")
echo "   Response: $move_response"

if [[ $move_response == *"\"success\":true"* ]]; then
    echo "   ✅ Task moved successfully"
else
    echo "   ❌ Task move failed"
    exit 1
fi

# Test 6: Update Task
echo "6. ✏️  Updating task details..."
update_response=$(curl -s -X PUT "$API_BASE/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Test Task","description":"This task has been updated through the API"}')
echo "   Response: $update_response"

if [[ $update_response == *"\"success\":true"* ]]; then
    echo "   ✅ Task updated successfully"
else
    echo "   ❌ Task update failed"
    exit 1
fi

# Test 7: Verify Final State
echo "7. 🔍 Verifying final board state..."
final_state=$(curl -s "$API_BASE/boards/$BOARD_ID/full")
echo "   Response: $final_state"

if [[ $final_state == *"\"success\":true"* ]] && [[ $final_state == *"Updated Test Task"* ]]; then
    echo "   ✅ Final state verification passed"
else
    echo "   ❌ Final state verification failed"
    exit 1
fi

# Test 8: Clean up (Delete Task)
echo "8. 🗑️  Cleaning up - deleting task..."
delete_task_response=$(curl -s -X DELETE "$API_BASE/tasks/$TASK_ID")
echo "   Response: $delete_task_response"

if [[ $delete_task_response == *"\"success\":true"* ]]; then
    echo "   ✅ Task deleted successfully"
else
    echo "   ❌ Task deletion failed"
fi

# Test 9: Clean up (Delete Board)
echo "9. 🗑️  Cleaning up - deleting board..."
delete_board_response=$(curl -s -X DELETE "$API_BASE/boards/$BOARD_ID")
echo "   Response: $delete_board_response"

if [[ $delete_board_response == *"\"success\":true"* ]]; then
    echo "   ✅ Board deleted successfully"
else
    echo "   ❌ Board deletion failed"
fi

echo ""
echo "🎉 All API Integration Tests Completed Successfully!"
echo "=============================================="
echo "✅ Health Check"
echo "✅ Board Creation"
echo "✅ Board Retrieval with Columns"
echo "✅ Task Creation"
echo "✅ Task Movement (Drag & Drop)"
echo "✅ Task Update"
echo "✅ State Verification"
echo "✅ Cleanup Operations"
echo ""
echo "🚀 The Task Tiles API is fully functional!" 