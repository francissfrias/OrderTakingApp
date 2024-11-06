export const capitalize = (str: string) => {
  if (!str) return;
  return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};

export const getPathname = ({ str, name }: { str: string; name?: string }) => {
  if (!str) return;
  const string = decodeURI(str);
  const pathParts = string.split('/').filter(Boolean); // Remove empty parts from split

  console.log(pathParts);

  if (pathParts.length > 2) {
    const lastPart = pathParts.pop(); // Remove and get the last part of the path
    const dynamicPart = pathParts.pop(); // Remove and get the second last part of the path

    if (lastPart && dynamicPart) {
      return `Edit ${
        name ||
        lastPart.charAt(0) +
          lastPart.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')
      } - ${
        dynamicPart.charAt(0).toUpperCase() +
        dynamicPart.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')
      } Page`;
    }
  } else {
    const lastWord = pathParts.pop(); // Remove and get the last part of the path
    if (lastWord) {
      return (
        lastWord.charAt(0).toUpperCase() +
        lastWord.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2') +
        ' Page'
      );
    }
  }
};

export const getPathnameBreadcrumbs = (str: string) => {
  if (!str) return;

  const string = decodeURI(str);
  const split = string.split('/');

  if (!split[1]) {
    return { title: 'Customer Page' };
  }

  if (split[1].startsWith('create')) {
    const title = `Create ${capitalize(split[1].slice(6))} Page`;
    return { title };
  }

  if (split[1].startsWith('update')) {
    const title = `Update ${capitalize(split[1].slice(6))} Page`;
    return { title };
  }

  const title = `${capitalize(split[1])} Page`;
  return { title };
};

export const mappedDataTable = (arrayData: any) =>
  arrayData.map(({ _id, ...rest }: { _id: string; rest: unknown }) => ({
    ...rest,
    _id: _id.toString(),
  }));
