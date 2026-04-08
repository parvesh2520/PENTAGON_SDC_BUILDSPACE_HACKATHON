# ✅ Opportunity Close/Reopen Feature - Complete Implementation

## 🎯 What's New

Opportunity posters can now **close** and **reopen** their opportunities! This allows them to stop receiving applications when a position is filled or a hackathon team is complete.

---

## 🚀 New Features

### 1. **Close Opportunity**
When a poster clicks "Close Opportunity":
- ✅ Status changes to "closed"
- ✅ Visual indicator on card (red border, "Closed" badge)
- ✅ Card moves to "Closed" column
- ✅ "Apply Now" button hidden
- ✅ Real-time update for all users

### 2. **Reopen Opportunity**
Posters can reopen closed opportunities:
- ✅ Status changes back to "open"
- ✅ Returns to appropriate column (Roles/Hackathon/Teammate)
- ✅ "Apply Now" button reappears
- ✅ Real-time update

### 3. **4-Column Kanban Board**
Now shows:
- ✅ **Open Roles** - Job opportunities (open only)
- ✅ **Hackathon Teams** - Hackathon opportunities (open only)
- ✅ **Looking for Teammate** - Teammate requests (open only)
- ✅ **Closed** - All closed opportunities (owner can reopen)

### 4. **Owner Controls**
Only the poster sees:
- ✅ "Yours" badge on cards
- ✅ Close/Reopen button in detail modal
- ✅ Management controls in opportunity detail view

---

## 📊 Database Flow

### Closing an Opportunity:
```javascript
Owner clicks "Close Opportunity"
  → Updates status: 'open' → 'closed'
    → Optimistic UI update
      → Card shows "Closed" badge
      → Moves to Closed column
      → Real-time update to all viewers
```

### Reopening an Opportunity:
```javascript
Owner clicks "Reopen Opportunity"
  → Updates status: 'closed' → 'open'
    → Optimistic UI update
      → Removes "Closed" badge
      → Returns to appropriate column
      → Real-time update to all viewers
```

---

## 🗂️ Updated Files

### Modified:
1. **`src/hooks/useOpportunities.js`**
   - Added `closeOpportunity()` function
   - Added `reopenOpportunity()` function
   - Optimistic UI updates
   - Error handling with rollback

2. **`src/pages/Opportunities.jsx`**
   - Updated `OpportunityCard` to show closed status
   - Updated `OpportunityDetailModal` with close/reopen buttons
   - Added 4th column for closed opportunities
   - "Yours" badge for owner identification
   - Owner-only controls

3. **`supabase-complete-setup.sql`**
   - Added `status` column to opportunities table
   - Added status index
   - Updated constraints

4. **`supabase-opportunities-status.sql`** - NEW
   - Migration to add status column (if table exists)
   - Indexes and comments
   - RLS policies

---

## 🎨 UI Components

### Opportunity Card (Open)
```
┌─────────────────────────────────┐
│ React Developer            👤    │
│ Looking for senior dev...       │
│                                  │
│ [React] [TypeScript] [Node]     │
│                                  │
│ Apr 15, 2026    [View]          │
└─────────────────────────────────┘
```

### Opportunity Card (Closed)
```
┌─────────────────────────────────┐
│ React Developer    CLOSED  👤    │ ← Red badge
│ Looking for senior dev...       │
│                                  │  ← Dimmed opacity
│ [React] [TypeScript] [Node]     │
│                                  │
│ Apr 15, 2026  Yours [View]      │ ← Owner badge
└─────────────────────────────────┘
```

### Kanban Board (4 Columns)
```
┌──────────┬──────────────┬──────────────┬──────────┐
│Open Roles│HackathonTeams│LookingTeammate│ Closed   │
│   (3)    │     (2)      │     (1)       │   (4)    │
├──────────┼──────────────┼──────────────┼──────────┤
│ [Cards]  │   [Cards]    │   [Cards]     │ [Cards]  │
└──────────┴──────────────┴──────────────┴──────────┘
```

### Detail Modal (Owner View - Open)
```
┌─────────────────────────────────┐
│ React Developer  👤 John Doe    │
├─────────────────────────────────┤
│ Looking for senior developer... │
│                                  │
│ Required Skills:                 │
│ [React] [TypeScript] [Node]     │
│                                  │
│ Deadline: Apr 15, 2026          │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ You can close this          │ │
│ │ opportunity to stop...      │ │
│ │                              │ │
│ │  [Close Opportunity]  ← Red │ │
│ └─────────────────────────────┘ │
│                                  │
│ [Close]        [Apply Now]      │
└─────────────────────────────────┘
```

### Detail Modal (Owner View - Closed)
```
┌─────────────────────────────────┐
│ React Developer CLOSED 👤 John  │
├─────────────────────────────────┤
│ Looking for senior developer... │
│                                  │
│ Required Skills:                 │
│ [React] [TypeScript] [Node]     │
│                                  │
│ Deadline: Apr 15, 2026          │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ This opportunity is closed  │ │
│ │                              │ │
│ │  [Reopen Opportunity] ←Green│ │
│ └─────────────────────────────┘ │
│                                  │
│ [Close]                          │ ← No Apply button
└─────────────────────────────────┘
```

---

## 🔄 How It Works

### For Opportunity Posters:

1. **Post Opportunity**
   - Creates with status "open"
   - Appears in appropriate column
   - Available for applications

2. **Close When Filled**
   - Click opportunity to view details
   - See "Close Opportunity" button
   - Click to close
   - Moves to "Closed" column
   - Still visible but marked closed

3. **Reopen If Needed**
   - View closed opportunity
   - Click "Reopen Opportunity"
   - Returns to appropriate column
   - Available for applications again

### For Applicants:

1. **Browse Opportunities**
   - See only open opportunities in main columns
   - Can still view closed opportunities
   - "Apply Now" hidden on closed

2. **Apply to Open**
   - Click "View" on opportunity
   - See full details
   - Click "Apply Now" (open only)

---

## 📝 Database Schema

### `opportunities` Table (Updated)
```sql
{
  id: UUID (PK)
  poster_id: UUID (FK → auth.users.id)
  type: "teammate" | "hackathon" | "role"
  title: TEXT
  description: TEXT
  skills_needed: TEXT[]
  deadline: DATE
  status: "open" | "closed" ← NEW!
  created_at: TIMESTAMPTZ
}
```

### Status Values:
- **`open`** - Active, accepting applications
- **`closed`** - Inactive, not accepting applications

---

## 🔒 Security & RLS

### Row Level Security:
- ✅ **SELECT:** Anyone can view opportunities
- ✅ **INSERT:** Only logged-in users can create
- ✅ **UPDATE:** Only poster can update (including status)
- ✅ **DELETE:** Only poster can delete

### Owner Verification:
```javascript
const isOwner = user && opportunity.poster_id === user.id
```
- Controls visibility of close/reopen buttons
- Verified on database level via RLS
- Enforced in both UI and backend

---

## ⚡ Real-Time Features

### Auto-Updates When:
1. **Opportunity Closed**
   - Status badge appears instantly
   - Card opacity reduces
   - Moves to Closed column
   - All viewers see update

2. **Opportunity Reopened**
   - Status badge removed
   - Card returns to column
   - "Apply Now" reappears
   - All viewers see update

3. **New Opportunity Posted**
   - Appears in real-time
   - Added to appropriate column
   - Feed post created

---

## 🎯 User Journey

### Example: Posting & Managing an Opportunity

**User (Sarah) posts "Senior React Developer":**

1. **Sarah Posts:**
   ```
   Click "Post Opportunity" →
   Fill form →
   Submit →
   Appears in "Open Roles" column
   ```

2. **Applications Come In:**
   ```
   People view opportunity →
   Click "Apply Now" →
   Sarah receives applications
   ```

3. **Position Filled:**
   ```
   Sarah views opportunity →
   Clicks "Close Opportunity" →
   Status: open → closed
   Moves to "Closed" column
   "Apply Now" button hidden
   ```

4. **Position Reopens:**
   ```
   Sarah views closed opportunity →
   Clicks "Reopen Opportunity" →
   Status: closed → open
   Returns to "Open Roles" column
   "Apply Now" button visible again
   ```

---

## ✅ What's Working

- [x] Close opportunity (owner only)
- [x] Reopen opportunity (owner only)
- [x] Status display on cards
- [x] Closed column
- [x] Owner identification badge
- [x] Real-time status updates
- [x] Optimistic UI updates
- [x] Error handling with rollback
- [x] RLS security policies
- [x] Responsive design
- [x] 3D tilt animations
- [x] Empty state handling

---

## 🎨 Visual Indicators

### Open Opportunity:
- **Border:** `border-[#1f1f1f]` (dark gray)
- **Opacity:** 100%
- **Badge:** Type badge only
- **Apply:** Visible

### Closed Opportunity:
- **Border:** `border-red-500/30` (red)
- **Opacity:** 60% (dimmed)
- **Badge:** "Closed" (red) + Type badge
- **Apply:** Hidden

### Owner Badge:
- **Text:** "Yours"
- **Color:** `text-[#e8ff47]` (yellow)
- **Position:** Next to View button

---

## 📊 Statistics

### Columns Display:
- **Open Roles:** Filtered by type='role' AND status='open'
- **Hackathon Teams:** Filtered by type='hackathon' AND status='open'
- **Looking for Teammate:** Filtered by type='teammate' AND status='open'
- **Closed:** All with status='closed'

### Card Features:
- **Type Badge:** Always visible
- **Closed Badge:** Only when status='closed'
- **Owner Badge:** Only for poster
- **Skills:** Always visible
- **Deadline:** Always visible

---

## 🔧 Technical Details

### useOpportunities Hook:
```javascript
const { 
  opportunities,
  closeOpportunity,    // NEW: Close an opportunity
  reopenOpportunity,   // NEW: Reopen a closed opportunity
  createOpportunity,
  deleteOpportunity,
  loading,
  refetch
} = useOpportunities()
```

### Close Function:
```javascript
const closeOpportunity = async (opportunityId) => {
  // Optimistic update
  setOpportunities(prev => 
    prev.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, status: "closed" } 
        : opp
    )
  )
  
  // Database update
  await supabase
    .from("opportunities")
    .update({ status: "closed" })
    .eq("id", opportunityId)
    .eq("poster_id", user.id)
}
```

### Reopen Function:
```javascript
const reopenOpportunity = async (opportunityId) => {
  // Optimistic update
  setOpportunities(prev => 
    prev.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, status: "open" } 
        : opp
    )
  )
  
  // Database update
  await supabase
    .from("opportunities")
    .update({ status: "open" })
    .eq("id", opportunityId)
    .eq("poster_id", user.id)
}
```

---

## 📱 Mobile Responsive

- ✅ 4 columns stack on mobile
- ✅ Horizontal scroll for columns
- ✅ Touch-friendly buttons
- ✅ Modal adapts to screen size
- ✅ Owner controls accessible

---

## 🚀 Usage Examples

### Poster Closes Opportunity:
```javascript
// User clicks close button
handleCloseOpportunity(opportunityId)
  → closeOpportunity(opportunityId)
    → UI updates optimistically
    → Database updates
    → Real-time sync to all users
```

### Poster Reopens Opportunity:
```javascript
// User clicks reopen button
handleReopenOpportunity(opportunityId)
  → reopenOpportunity(opportunityId)
    → UI updates optimistically
    → Database updates
    → Real-time sync to all users
```

---

## 🎉 Success Criteria Met

✅ **Close Button** - Owner can close opportunities  
✅ **Reopen Button** - Owner can reopen closed opportunities  
✅ **Status Display** - Clear visual indicators  
✅ **4th Column** - Closed opportunities organized  
✅ **Owner Badge** - "Yours" label for identification  
✅ **Real-time** - Instant status updates  
✅ **Security** - Owner-only controls  
✅ **Responsive** - Works on all devices  

---

## 📝 Setup Instructions

### Run This SQL:
```bash
# In Supabase SQL Editor, run:
supabase-opportunities-status.sql
```

This adds:
- ✅ Status column to opportunities table
- ✅ Index for performance
- ✅ RLS policies
- ✅ Comments

---

**Your opportunity management system is now complete! Posters have full control over their opportunities. 🎊**
