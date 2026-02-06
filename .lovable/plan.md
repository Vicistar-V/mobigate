

## Fix Report & Comment Submenus for Mobile

### Problem
The "Report" and "Comment" dropdown menu items use `DropdownMenuSub` which creates side-positioned nested menus. On mobile devices, these submenus:
- Often appear off-screen or get clipped
- Don't respond well to touch interactions
- Are designed for desktop hover, not mobile tap

### Solution
Replace the entire `DropdownMenu` with a mobile-optimized `Drawer` (bottom sheet) and convert the nested submenus into inline `Accordion` sections.

---

## Implementation Details

### File: `src/components/community/leadership/LeadershipMemberActionsMenu.tsx`

**Key Changes:**
1. Replace `DropdownMenu` with `Drawer` component
2. Replace `DropdownMenuSub` (Comment) with `Accordion` inline expansion
3. Replace `DropdownMenuSub` (Report) with `Accordion` inline expansion
4. Ensure all action items have minimum 48px (h-12) touch targets
5. Add proper separators between action groups

**New Structure:**

```tsx
<Drawer open={isOpen} onOpenChange={setIsOpen}>
  <DrawerTrigger asChild>
    <Button variant="ghost" size="icon" className="h-10 w-10">
      <MoreVertical className="h-5 w-5" />
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>{member.name}</DrawerTitle>
      <DrawerDescription>{member.position}</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>
      {/* Regular action buttons - h-12 touch targets */}
      <button className="flex items-center h-12 w-full gap-3 ...">
        <User /> View Profile
      </button>
      
      {/* Comment section - Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="comment">
          <AccordionTrigger className="h-12">
            <MessageCircle /> Comment
          </AccordionTrigger>
          <AccordionContent>
            <button onClick={handleAddComment}>Add Comment</button>
            <button onClick={handleViewComments}>View All</button>
          </AccordionContent>
        </AccordionItem>
        
        {/* Report section - Accordion */}
        <AccordionItem value="report">
          <AccordionTrigger className="h-12">
            <Flag /> Report
          </AccordionTrigger>
          <AccordionContent>
            <button onClick={handleNewReport}>New Report</button>
            <button onClick={handleViewPendingReports}>Pending</button>
            <button onClick={handleViewResolvedReports}>Resolved</button>
            <button onClick={handleViewAbsolvedReports}>Absolved</button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Block/Admin actions */}
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

---

## UI Improvements

| Element | Before | After |
|---------|--------|-------|
| Menu Container | Dropdown (overlay) | Drawer (bottom sheet) |
| Comment/Report | DropdownMenuSub (side-positioned) | Accordion (inline expansion) |
| Touch Targets | py-2.5 (~40px) | h-12 (48px) |
| Submenu Access | Tap opens side panel | Tap expands inline |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/community/leadership/LeadershipMemberActionsMenu.tsx` | Complete refactor to use Drawer + Accordion pattern |

---

## Expected Outcome

- Tapping "Comment" expands inline to show "Add" and "View All" options
- Tapping "Report" expands inline to show "New Report", "Pending", "Resolved", "Absolved" options
- All actions are visible and accessible on mobile without off-screen positioning
- Consistent with mobile-first design patterns

