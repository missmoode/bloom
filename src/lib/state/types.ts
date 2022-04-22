type DataObject = { [key: string]: DataProperty };
// wish there was a shorthand for this
type DataArray = (string[] | number[] | boolean[] | DataObject[] | DataArray[]);
type DataProperty = 
| string
| number
| boolean
| DataObject
| DataArray

type DataTree<T extends DataObject> = T & 
{
  load: (data: T) => void;
};