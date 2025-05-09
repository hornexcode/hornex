interface InputLabelProps {
  title: string;
  subTitle?: string;
  important?: boolean;
}

function InputLabel({ title, subTitle, important }: InputLabelProps) {
  return (
    <div className="relative mb-3">
      <span className="text-body mb-2 block font-medium">
        {title}
        {important && (
          <sup className="text-red-500 ltr:ml-1.5 rtl:mr-1.5">*</sup>
        )}
      </span>
      {subTitle && (
        <span className="mt-1 block text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:text-sm">
          {subTitle}
        </span>
      )}
    </div>
  );
}

export default InputLabel;
