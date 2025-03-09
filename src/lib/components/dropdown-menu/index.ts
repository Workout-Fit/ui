import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import Content from './dropdown-menu-content.svelte';
import GroupHeading from './dropdown-menu-group-heading.svelte';
import Item from './dropdown-menu-item.svelte';
import Label from './dropdown-menu-label.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Shortcut from './dropdown-menu-shortcut.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';

const Sub = DropdownMenuPrimitive.Sub;
const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;
const RadioGroup = DropdownMenuPrimitive.RadioGroup;

export {
	Content,
	Root as DropdownMenu,
	Content as DropdownMenuContent,
	Group as DropdownMenuGroup,
	GroupHeading as DropdownMenuGroupHeading,
	Item as DropdownMenuItem,
	Label as DropdownMenuLabel,
	RadioGroup as DropdownMenuRadioGroup,
	Separator as DropdownMenuSeparator,
	Shortcut as DropdownMenuShortcut,
	Sub as DropdownMenuSub,
	SubContent as DropdownMenuSubContent,
	Trigger as DropdownMenuTrigger,
	Group,
	GroupHeading,
	Item,
	Label,
	RadioGroup,
	Root,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	Trigger
};
