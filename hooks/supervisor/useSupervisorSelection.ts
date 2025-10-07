export function useSupervisorSelection(
  selectedEntries: string[],
  setSelectedEntries: (entries: string[]) => void,
  pendingHours: any[]
) {
  const handleSelectEntry = (entryId: string, checked: boolean) => {
    if (checked) {
      setSelectedEntries([...selectedEntries, entryId])
    } else {
      setSelectedEntries(selectedEntries.filter((id) => id !== entryId))
    }
  }
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(pendingHours.map((entry) => entry._id))
    } else {
      setSelectedEntries([])
    }
  }
  return { handleSelectEntry, handleSelectAll }
}
